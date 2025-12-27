const { CreateInvoiceService, PaymentSuccessService, PaymentCancelService, PaymentFailService, PaymentIPNService, InvoiceListService } = require("../service/InvoiceService");

exports.CreateInvoice = async (req, res) => {
    let data = await CreateInvoiceService(req);
    return res.status(200).json(data)
}

exports.PaymentSuccess = async (req, res) => {
    let result = await PaymentSuccessService(req);
    return res.status(200).json(result)
}

exports.PaymentCancel = async (req, res) => {
    let result = await PaymentCancelService(req);
    return res.status(200).json(result)
}

exports.PaymentFail = async (req, res) => {
    let result = await PaymentFailService(req);
    return res.status(200).json(result)
}

exports.PaymentIPN = async (req, res) => {
    let result = await PaymentIPNService(req);
    return res.status(200).json(result)
}

exports.InvoiceList = async (req, res) => {
    let data = await InvoiceListService(req);
    return res.status(200).json(data)
}