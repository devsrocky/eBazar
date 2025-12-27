const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const CartModel = require('../model/CartModel');


const SaveCartService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        let Postbody = req.body;
        Postbody.userID = user['userID'];
        await CartModel.create(Postbody);
        return {status: 'success', message: 'Cart save success'}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const UpdateCartService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        let cartID = req.params.cartID;
        let Postbody = req.body;

        await CartModel.updateOne({_id: new ObjectId(cartID), userID: new ObjectId(user['userID'])}, {$set: Postbody});
        return {status: 'success', message: 'Cart update success'}

    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const CartListService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        let matchStage = {$match: {userID: new ObjectId(user['userID'])}}


        let productJoin = {$lookup: {from: 'products', localField: 'productID', foreignField: '_id', as: 'product'}};
        let brandJoin = {$lookup: {from: 'brands', localField: 'product.brandID', foreignField: '_id', as: 'brand'}};
        let categJoin = {$lookup: {from: 'categories', localField: 'product.categoryID', foreignField: '_id', as: 'category'}};

        let prodUnwind = {$unwind: '$product'};
        let brandUnwind = {$unwind: '$brand'};
        let categUnwind = {$unwind: '$category'};

        let projection = {$project: {
            'userID': 0,
            'createdAt': 0,
            'updatedAt': 0,
            'product._id': 0,
            'product.createdAt': 0,
            'product.updatedAt': 0,
            'product.categoryID': 0,
            'product.brandID': 0,
            'brand._id': 0,
            'brand.createdAt': 0,
            'brand.updatedAt': 0,
            'category._id': 0,
            'category.createdAt': 0,
            'category.updatedAt': 0
        }}

        let data = await CartModel.aggregate([
            matchStage,
            productJoin,
            brandJoin,
            categJoin,
            prodUnwind,
            brandUnwind,
            categUnwind,
            projection
        ])
        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const RemoveCartService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        let cartID = req.params.cartID;
        await CartModel.deleteOne({_id: new ObjectId(cartID), userID: new ObjectId(user['userID'])})
        return {status: 'success', message: 'Cart removed success'};
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

module.exports = {
    SaveCartService,
    UpdateCartService,
    CartListService,
    RemoveCartService
}