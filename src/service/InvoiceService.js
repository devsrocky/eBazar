const axios = require('axios');
const FormData = require('form-data');
const mongoose = require('mongoose');
const ObjectID = mongoose.Types.ObjectId;

const CartModel = require('../model/CartModel');
const ProfileModel = require('../model/ProfileModel');
const ProductModel = require('../model/ProductModel');
const InvoiceModel = require('../model/InvoiceModel');
const InvoiceProductModel = require('../model/InvoiceProductModel');
const PaymentSettingsModel = require('../model/PaymentSettingModel');


const CreateInvoiceService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);

        // STEP: 01 - CALCULATE TOTAL PAYABLE & VAT
        let matchStage = {$match: {userID: new ObjectID(user['userID'])}};
        let productJoin = {$lookup: {from: 'products', localField: 'productID', foreignField: '_id', as: 'product'}};
        let productUnwind = {$unwind: '$product'};
        let CartProducts = await CartModel.aggregate([matchStage, productJoin, productUnwind])

        let totalAmount = 0;
        CartProducts.forEach((element) => {
            let price;
            if(element['product']['discount']){
                price = parseFloat(element['product']['discountPrice'])
            }else{
                price = parseFloat(element['product']['price'])
            }
            totalAmount += parseFloat(element['qty']) * price;
        })

        let vat = totalAmount * 0.05; // 5%
        let payable = totalAmount + vat;

        // STEP 02: PREPARE CUSTOMMER DETAILS & SHIPPING DETAILS
        let Profile = await ProfileModel.aggregate([matchStage]);
        let cus_details = `Name: ${Profile[0]['cus_name']}, Email: ${user['email']}, Address: ${Profile[0]['cus_add']}, Phone: ${Profile[0]['cus_phone']}`;
        let ship_details = `Name: ${Profile[0]['ship_name']}, city: ${Profile[0]['ship_city']}, Address: ${Profile[0]['ship_add']}, Phone: ${Profile[0]['ship_phone']}`;


        // STEP 03: TRANSACTION & OTHER'S ID
        let tran_id = Math.floor(10000000 + Math.random() * 90000000);
        let val_id = 0;
        let delivery_status = 'pending';
        let payment_status = 'pending';

        // SETP 04: CREATE INVOICE
        let createInvoice = await InvoiceModel.create({
                userID: user['userID'],
                payable: payable,
                cus_details: cus_details,
                ship_details: ship_details,
                tran_id: tran_id,
                val_id: val_id,
                payment_status: payment_status,
                delivery_status: delivery_status,
                total: totalAmount,
                vat: vat
        })

        // STEP 05: CREATE INVOICE PRODUCT
        let invoiceID = createInvoice['_id'];

        CartProducts.forEach(async (element) => {
            await InvoiceProductModel.create({
                userID: user['userID'],
                productID: element['productID'],
                invoiceID: invoiceID,
                qty: element['qty'],
                price: element['product']['discount']? element['product']['discountPrice']: element['product']['price'],
                color: element['color'],
                size: element['size']
            })
        })

        // SETP 06: REMOVE CARTS
        await CartModel.deleteMany({userID: new ObjectID(user['userID'])})

        // STEP 07: PREPARE SSL PAYMENTS
        let Payment = await PaymentSettingsModel.find();
        const form = new FormData();

        form.append('store_id', `${Payment[0]['store_id']}`);
        form.append('store_passwd', Payment[0]['store_passwd']);
        form.append('total_amount', payable.toString());
        form.append('currency', Payment[0]['currency']);
        form.append('tran_id', tran_id);

        form.append('success_url', `${Payment[0]['success_url']}/${tran_id}`);
        form.append('fail_url', `${Payment[0]['fail_url']}/${tran_id}`);
        form.append('cancel_url', `${Payment[0]['cancel_url']}/${tran_id}`);
        form.append('ipn_url', `${Payment[0]['ipn_url']}/${tran_id}`);

        form.append('cus_name', `${Profile[0]['cus_name']}`);
        form.append('cus_email', `${user['email']}`);
        form.append('cus_add1', `${Profile[0]['cus_add']}`);
        form.append('cus_add2', `${Profile[0]['cus_add']}`);
        form.append('cus_city', `${Profile[0]['cus_city']}`);
        form.append('cus_state', `${Profile[0]['cus_state']}`);
        form.append('cus_postcode', `${Profile[0]['cus_postcode']}`);
        form.append('cus_country', `${Profile[0]['cus_country']}`);
        form.append('cus_phone', `${Profile[0]['cus_phone']}`);
        form.append('cus_fax', `${Profile[0]['cus_fax']}`);

        form.append('shipping_method', `YES`);
        form.append('ship_name', `${Profile[0]['ship_name']}`);
        form.append('ship_add1', `${Profile[0]['ship_add']}`);
        form.append('ship_add2', `${Profile[0]['ship_add']}`);
        form.append('ship_city', `${Profile[0]['ship_city']}`);
        form.append('ship_state', `${Profile[0]['ship_state']}`);
        form.append('ship_postcode', `${Profile[0]['ship_postcode']}`);
        form.append('ship_country', `${Profile[0]['ship_country']}`);

        form.append('product_name', `${Profile[0]['According Invoice']}`);
        form.append('product_category', `${Profile[0]['According Invoice']}`);
        form.append('product_profile', `${Profile[0]['According Invoice']}`);
        form.append('product_amount', `${Profile[0]['According Invoice']}`);

        let SSL = await axios.post(Payment[0]['init_url'], form)

        return {status: 'success', data: SSL.data};
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}


const PaymentSuccessService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: "success"})
        return {status: 'success', message: 'Payment success'}

    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const PaymentCancelService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: "Cancel"})
        return {status: 'success', message: 'Payment Canceled'}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const PaymentFailService = async (req) => {
    try {
        let trxID = req.params.trxID;
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: "fail"})
        return {status: 'success', message: 'Payment failed'}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const PaymentIPNService = async (req) => {
    try {
        let trxID = req.params.trxID;
        let status = req.body['status'];
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: status})
        return {status: 'IPN'}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}


const InvoiceListService = async (req) => {
    try {
        
        let user = JSON.parse(req.headers['Userdetails']);
        let userId = new ObjectID(user['userID']);
        let invoceID = new ObjectID(req.params.invoceID);

        let matchStage = {$match: {userID: userId, invoiceID: invoceID}};

        let data = await InvoiceProductModel.aggregate([
            matchStage
        ])

        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}


module.exports = {
    CreateInvoiceService,
    PaymentSuccessService,
    PaymentCancelService,
    PaymentFailService,
    PaymentIPNService,
    InvoiceListService
}