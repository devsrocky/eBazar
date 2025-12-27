const express = require('express');
const router = express.Router();

// AUTH-MIDDLEWARE
const Auth = require('../middleware/AuthVerification');

// CONTROLLERS
const ProductController = require('../controller/ProductController');
const UserController = require('../controller/UserController');
const WishController = require('../controller/WishController');
const CartController = require('../controller/CartController');
const InvoiceController = require('../controller/InvoiceController');


// PRODUCTS || routes
router.get('/BrandList', ProductController.BrandList)
router.get('/CategList', ProductController.CategList)
router.get('/SliderList', ProductController.SliderList)
router.get('/ListByBrand/:brandID', ProductController.ListByBrand)
router.get('/ListByCateg/:categID', ProductController.ListByCateg)
router.get('/ListByRemark/:Remark', ProductController.ListByRemark)
router.get('/ListBySimilar/:categoryID', ProductController.ListBySimilar)
router.get('/ListByKeyword/:Keyword', ProductController.ListByKeyword)
router.post('/ListByFilter', ProductController.ListByFilter)
router.get('/ProductDetails/:productID', ProductController.ProductDetails)

//  REVIEWS || routes
router.get('/ReviewList/:productID', ProductController.ReviewList)

// USERS || routes
router.get('/OTPSender/:email', UserController.OTPSender)
router.get('/VerifyLogin/:email/:OTP', UserController.VerifyLogin)
router.get('/Logout', UserController.Logout)

router.post('/SaveProfile', Auth, UserController.SaveProfile)
router.get('/ProfileDetails', Auth, UserController.ProfileDetails)

// WISHES || routes
router.post('/SaveWishList', Auth, WishController.SaveWishList)
router.post('/RemoveWish', Auth, WishController.RemoveWish)
router.get('/WishList', Auth, WishController.WishList)


// CARTS || routes
router.post('/SaveCart', Auth, CartController.SaveCart)
router.post('/UpdateCart/:cartID', Auth, CartController.UpdateCart)
router.get('/CartList', Auth, CartController.CartList)
router.get('/RemoveCart/:cartID', Auth, CartController.RemoveCart)

// INVOICE || routes
router.post('/CreateInvoice', Auth, InvoiceController.CreateInvoice)
router.get('/InvoiceList/:userId', Auth, InvoiceController.InvoiceList)


// PAYMENT || routes
router.post('/PaymentSuccess/:trxID', InvoiceController.PaymentSuccess);
router.post('/PaymentCancel/:trxID', InvoiceController.PaymentCancel);
router.post('/PaymentFail/:trxID', InvoiceController.PaymentFail);
router.post('/PaymentIPN/:trxID', InvoiceController.PaymentIPN);


module.exports = router;