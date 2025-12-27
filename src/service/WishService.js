const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const WishModel = require('../model/WishModel');

const SaveWishService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        let userID =user['userID']
        let Postbody = req.body;
        Postbody.userID = userID;
        await WishModel.updateOne(Postbody, {$set: Postbody}, {upsert: true})
        return {status: 'success', message: 'Product saved as wish'}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const WishListService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        let matchStage = {$match: {userID: new ObjectId(user['userID'])}}

        let productJoin = {$lookup: {from: 'products', localField: 'productID', foreignField: '_id', as: 'product'}};
        let brandJoin = {$lookup: {from: 'brands', localField: 'product.brandID', foreignField: '_id', as: 'brand'}};
        let categJoin = {$lookup: {from: 'categories', localField: 'product.categoryID', foreignField: '_id', as: 'category'}}

        let productUnwind = {$unwind: '$product'}
        let brandUnwind = {$unwind: '$brand'}
        let categUnwind = {$unwind: '$category'}

        let Projection = {
            $project: {
                '_id': 0,
                'userID': 0,
                'createdAt': 0,
                'updatedAt': 0,
                'product._id': 0,
                'product.brandID': 0,
                'product.categoryID': 0,
                'brand._id': 0, 
                'category._id': 0
            }
        }

        let data = await WishModel.aggregate([
            matchStage,
            productJoin, brandJoin, categJoin,
            productUnwind, brandUnwind, categUnwind,
            Projection
        ])
        
        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const RemoveWishService = async (req) => {
    try {
        let user = JSON.parse(req.headers['Userdetails']);
        let Postbody = req.body;
        Postbody.userID = user['userID'];
        await WishModel.deleteOne(Postbody);
        return {status: 'success', message: 'Wish removed successed'};
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

module.exports = {
    SaveWishService,
    WishListService,
    RemoveWishService
}