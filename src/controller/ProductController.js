const { BrandListService, CategListService, SliderListService, ListByBrandService, ListByCategService, ListByRemarkService, ListBySimilarService, ListByKeywordService, ListByFilterService, ProductDetailsService, ReviewListService, AllProductsService } = require("../service/ProductService")

exports.AllProducts = async (req, res) => {
    let data = await AllProductsService(req);
    return res.status(200).json(data)
}

exports.BrandList = async (req, res) => {
    let data = await BrandListService();
    return res.status(200).json(data)
}

exports.CategList = async (req, res) => {
    let data = await CategListService();
    return res.status(200).json(data)
}

exports.SliderList = async (req, res) => {
    let data =  await SliderListService();
    return res.status(200).json(data)
}

exports.ListByBrand = async (req, res) => {
    let data = await ListByBrandService(req);
    return res.status(200).json(data)
}

exports.ListByCateg = async (req, res) => {
    let data = await ListByCategService(req);
    return res.status(200).json(data)
}

exports.ListByRemark = async (req, res) => {
    let data = await ListByRemarkService(req);
    return res.status(200).json(data)
}

exports.ListBySimilar = async (req, res) => {
    let data = await ListBySimilarService(req);
    return res.status(200).json(data)
}

exports.ListByKeyword = async (req, res) => {
    let data = await ListByKeywordService(req);
    return res.status(200).json(data)
}

exports.ListByFilter = async (req, res) => {
    let data = await ListByFilterService(req);
    return res.status(200).json(data)
}

exports.ProductDetails = async (req, res) => {
    let data = await ProductDetailsService(req);
    return res.status(200).json(data)
}

// REVIEWS CONTROLLERS
exports.ReviewList = async (req, res) => {
    let data = await ReviewListService(req);
    return res.status(200).json(data)
}