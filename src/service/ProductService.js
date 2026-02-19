const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const BrandModel = require('../model/BrandModel');
const CategoryModel = require('../model/CategoryModel');
const SliderModel = require('../model/SliderModel');
const ProductModel = require('../model/ProductModel');
const ReviewModel = require('../model/ReviewModel');


const AllProductsService = async (req) => {
    try{
        const sort = req.params.sort;
        let sortOption = {};
        let data;
        let projection = {$project: {
             "_id": 1,
            "title": 1,
            "price": 1,
            "discount": 1,
            "discountPrice": 1,
            "image":1,
            "brandName": '$brand.brandName',
            "categoryName":  "$category.categoryName"

        }}
        if(sort){
            if(sort === 'low'){
                sortOption = {price: -1}
            }else if(sort === 'high'){
                sortOption = {price: 1}
            }else if(sort === 'discount'){
                sortOption = {discount: -1 }
            }
            data = await ProductModel.aggregate([
                projection,
                {$sort: sortOption}
            ])
        }else{
            data = await ProductModel.aggregate([
            projection
        ])
        }




        return {status: 'success', message: data}

    }catch(err) {
        return {status: 'failed', message: err.toString()}
    }
}


const BrandListService = async () => {
    try {
        let data = await BrandModel.find();
        return {status: 'success', data: data}
        
    } catch (err) {
        // if(err.code === 11000 && err.keyPattern.brandName){
        //     return {status: 'exist', message: 'Name already taken'}
        // }
        return {status: 'failed', message: err.toString()}
    }
}

const CategListService = async () => {
    try {
        let data = await CategoryModel.find();
        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const SliderListService = async () => {
    try{
        let data = await SliderModel.find();
        return {status: 'success', data: data}

    }catch(err){
        return {status: 'failed', message: err.toString()}
    }
}


const ListByBrandService = async (req) => {
    try {

        let brandID = new ObjectId(req.params.brandID);
        let matchStage = {$match: {brandID: brandID}};

        let brandJoin = {$lookup: {from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand'}};
        let categJoin = {$lookup: {from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category'}};

        let brandUnwind = {$unwind: '$brand'};
        let categUnwind = {$unwind: '$category'};

        let projection = {$project: {

             "_id": 1,
            "title": 1,
            "price": 1,
            "discount": 1,
            "discountPrice": 1,
            "image":1,
            "brandName": '$brand.brandName',
            "category":  "$category.categoryName"

        }}

        let data = await ProductModel.aggregate([
            matchStage,
            brandJoin, categJoin,
            brandUnwind, categUnwind,
            projection
        ])
        return {status: 'success', data: data}
        
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ListByCategService = async (req) => {
    try {

        let categID = req.params.categID;
        let matchStage = {$match: {categoryID: new ObjectId(categID)}};


        let brandJoin = {$lookup: {from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand'}};
        let categJoin = {$lookup: {from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category'}};

        let brandUnwind = {$unwind: '$brand'};
        let categUnwind = {$unwind: '$category'};

        
        let projection = {$project: {

             "_id": 1,
            "title": 1,
            "price": 1,
            "discount": 1,
            "discountPrice": 1,
            "image":1,
            "brandName": '$brand.brandName',
            "categoryName":  "$category.categoryName"

        }}

        let data = await ProductModel.aggregate([
            matchStage,
            brandJoin, categJoin,
            brandUnwind, categUnwind,
            projection
        ])
        return {status: 'success', data: data}
        
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ListByRemarkService = async (req) => {
    try {
        let Remark = req.params.Remark;
        let matchStage = {$match: {remark: Remark}};

        let brandJoin = {$lookup: {from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand'}};
        let categJoin = {$lookup: {from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category'}}

        let brandUnwind = {$unwind: '$brand'};
        let categUnwind = {$unwind: '$category'};

        let projection = {$project: {

             "_id": 1,
            "title": 1,
            "price": 1,
            "discount": 1,
            "discountPrice": 1,
            "image":1,
            "brandName": '$brand.brandName',
            "categoryName":  "$category.categoryName"

        }}

        let data = await ProductModel.aggregate([
            matchStage,
            brandJoin, categJoin,
            brandUnwind, categUnwind,
            projection
        ])

        return {status: 'success', data: data}
        
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ListBySimilarService = async (req) => {
    try {
        let categoryID = req.params.categoryID;
        let matchStage = {$match: {categoryID: new ObjectId(categoryID)}};

        let brandJoin = {$lookup: {from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand'}}
        let categJoin = {$lookup: {from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category'}}

        let brandUnwind = {$unwind: '$brand'};
        let categUnwind = {$unwind: '$category'};

        let projection = {$project: {

             "_id": 1,
            "title": 1,
            "price": 1,
            "discount": 1,
            "discountPrice": 1,
            "image":1,
            "brandName": '$brand.brandName',
            "categoryName":  "$category.categoryName"

        }}

        let data = await ProductModel.aggregate([
            matchStage,
            brandJoin, categJoin,
            brandUnwind, categUnwind,
            projection
        ])
        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ListByKeywordService = async (req) => {
    try {
        
        let SearchRegex = {"$regex": req.params.Keyword, "$options": "i"};
        let SearchParams = [{title: SearchRegex}, {shortDes: SearchRegex}];
        let SearchQuery = {$or: SearchParams};
        let matchStage = {$match: SearchQuery};

        let brandJoin = {$lookup: {from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand'}};
        let categJoin = {$lookup: {from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category'}}

        let brandUnwind = {$unwind: '$brand'};
        let categUnwind = {$unwind: '$category'};

        let projection = {$project: {

             "_id": 1,
            "title": 1,
            "price": 1,
            "discount": 1,
            "discountPrice": 1,
            "image":1,
            "brandName": '$brand.brandName',
            "categoryName":  "$category.categoryName"

        }}

        let data = await ProductModel.aggregate([
            matchStage,
            brandJoin, categJoin, 
            brandUnwind, categUnwind,
            projection
        ])
        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ListByFilterService = async (req) => {
    try {
        let MatchCondition = {};
        if(req.body['categoryID']){
            MatchCondition.categoryID = new ObjectId(req.body['categoryID'])
        }
        if(req.body['brandID']){
            MatchCondition.brandID = new ObjectId(req.body.brandID)
        }
        let matchStage = {$match: MatchCondition}

        let AddFieldsStage = {
            $addFields: {
                numericPrice: {
                    $toInt: {
                        $cond: {
                            if: {$eq: ["$discount", true]},
                            then: "$discountPrice",
                            else: "$price"
                        }
                    }
                }
            }
        };

        let minPrice = parseInt(req.body['minPrice'])
        let maxPrice = parseInt(req.body['maxPrice'])

        let pipeline = (
            (!isNaN(minPrice) || !isNaN(maxPrice)) ?
            [
                {
                    $match: {
                        numericPrice: {
                            ...(!isNaN(minPrice) ? {$gte: minPrice} : {}),
                            ...(!isNaN(maxPrice) ? {$lte: maxPrice} : {})
                        }
                    }
                }
            ] : []
        )

        let brandJoin = {$lookup: {from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand'}};
        let categJoin = {$lookup: {from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category'}};
        let brandUnwind = {$unwind: '$brand'};
        let categUnwind = {$unwind: '$category'};
        let projection = {$project: {

             "_id": 1,
            "title": 1,
            "price": 1,
            "discount": 1,
            "discountPrice": 1,
            "image":1,
            "brandName": '$brand.brandName',
            "categoryName":  "$category.categoryName"

        }}

        let data = await ProductModel.aggregate([
            matchStage, AddFieldsStage,
            ...pipeline,
            brandJoin, categJoin,
            brandUnwind, categUnwind,
            projection
        ])

        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

const ProductDetailsService = async (req) => {
    try {
        let productID = req.params.productID;
        let matchStage = {$match: {_id: new ObjectId(productID)}};

        let brandJoin = {$lookup: {from: 'brands', localField: 'brandID', foreignField: '_id', as: 'brand'}};
        let categJoin = {$lookup: {from: 'categories', localField: 'categoryID', foreignField: '_id', as: 'category'}};
        let detalJoin = {$lookup: {from: 'productdetails', localField: '_id', foreignField: 'productID', as: 'details'}

        let brandUnwind = {$unwind: '$brand'};
        let categUnwind = {$unwind: '$category'};
        let detalUnwind = {$unwind: '$details'};

        let Projection = {$project: {
            'updatedAt': 0,
            'categoryID': 0,
            'brandID': 0,
            'brand.createdAt': 0,
            'brand.updatedAt': 0,
            'category.createdAt': 0,
            'category.updatedAt': 0,
        }}

        let data = await ProductModel.aggregate([
            matchStage,
            brandJoin, categJoin, detalJoin,
            brandUnwind, categUnwind, detalUnwind,
            Projection
        ])
        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}

// REVIEWS SERVICES
const ReviewListService = async (req) => {
    try {
        let productID = req.params.productID;
        let matchStage = {$match: {productID: new ObjectId(productID)}};

        let profileJoin = {$lookup: {from: 'profiles', localField: 'userID', foreignField: 'userID', as: 'profile'}}
        let profileUnwind = {$unwind: '$profile'};

        let Projection = {$project: {
            'des': 1,
            'rating': 1,
            'City': '$profile.cus_city',
            'name': '$profile.cus_name'
        }}

        let data = await ReviewModel.aggregate([
            matchStage,
            profileJoin,
            profileUnwind,
            Projection
        ])
        return {status: 'success', data: data}
    } catch (err) {
        return {status: 'failed', message: err.toString()}
    }
}



module.exports = {
    AllProductsService,
    BrandListService,
    CategListService,
    SliderListService,
    ListByBrandService,
    ListByCategService,
    ListByRemarkService,
    ListBySimilarService,
    ListByKeywordService,
    ListByFilterService,
    ProductDetailsService,
    ReviewListService
}
