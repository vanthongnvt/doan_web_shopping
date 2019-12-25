var express = require('express');
var passport =require('passport');
var router = express.Router({ mergeParams : true });
var authRedirectMiddleware=require('../../middleware/auth_redirect');
var accountController=require('../../controllers/customer/account_controller');

router.get('/',authRedirectMiddleware,accountController.userInfo);

// router.post('/dang-nhap', passport.authenticate('login' , {
// 	successRedirect : '/',
// 	failuerRedirect : '/',
// 	failuerFlash: true
// }));

// router.post('/dang-ky', passport.authenticate('signup' , {
// 	successRedirect : '/',
// 	failuerRedirect : '/',
// 	failuerFlash: true
// }));
router.post('/dang-nhap',accountController.login);

router.post('/dang-ky',accountController.signup);

router.get('/dang-xuat',accountController.logout);

router.get('/chinh-sua',authRedirectMiddleware,accountController.editInfoPage);

router.post('/chinh-sua',authRedirectMiddleware,accountController.updateInfo);

router.post('/update-avatar',authRedirectMiddleware,accountController.updateAvatar);

router.get('/lich-su-mua-hang',authRedirectMiddleware,accountController.ordersHistory);

router.get('/thay-doi-mat-khau',authRedirectMiddleware,accountController.changePasswordPage);

router.post('/thay-doi-mat-khau',authRedirectMiddleware,accountController.changePassword);

router.get('/don-hang/:id',authRedirectMiddleware,accountController.orderDetail);

router.get('/quen-mat-khau',accountController.forgotPassword);

router.get('/tao-moi-mat-khau/:refreshToken',accountController.resetPassword);

router.post('/dat-hang',authRedirectMiddleware,accountController.order);

module.exports = router;
