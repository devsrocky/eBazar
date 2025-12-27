const { SaveCartService, UpdateCartService, CartListService, RemoveCartService } = require("../service/CartServices");

exports.SaveCart = async (req, res) => {
    let data  = await SaveCartService(req);
    return res.status(200).json(data)
}

exports.UpdateCart = async (req, res) => {
    let data = await UpdateCartService(req);
    return res.status(200).json(data)
}

exports.CartList = async (req, res) => {
    let data = await CartListService(req);
    return res.status(200).json(data)
}

exports.RemoveCart = async (req, res) => {
    let data = await RemoveCartService(req);
    return res.status(200).json(data)
}