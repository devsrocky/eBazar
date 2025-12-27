const { SaveWishService, WishListService, RemoveWishService } = require("../service/WishService")

exports.SaveWishList = async (req, res) => {
    const data = await SaveWishService(req);
    return res.status(200).json(data)
}

exports.WishList = async (req, res) => {
    let data = await WishListService(req);
    return res.status(200).json(data)
}

exports.RemoveWish = async (req, res) => {
    let data = await RemoveWishService(req);
    return res.status(200).json(data)
}