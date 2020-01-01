var express = require('express');
var passport =require('passport');
var router = express.Router({ mergeParams : true });
var authRedirectMiddleware=require('../../middleware/auth_redirect');
var accountController=require('../../controllers/customer/account_controller');
const getMenu = require('../../middleware/get_menu');

router.get('/',getMenu,authRedirectMiddleware,accountController.userInfo);

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

router.get('/chinh-sua',getMenu,authRedirectMiddleware,accountController.editInfoPage);

router.post('/chinh-sua',authRedirectMiddleware,accountController.updateInfo);

router.post('/update-avatar',authRedirectMiddleware,accountController.updateAvatar);

router.get('/lich-su-mua-hang',getMenu,authRedirectMiddleware,accountController.ordersHistory);

router.get('/thay-doi-mat-khau',getMenu,authRedirectMiddleware,accountController.changePasswordPage);

router.post('/thay-doi-mat-khau',authRedirectMiddleware,accountController.changePassword);

router.get('/don-hang/:id',getMenu,authRedirectMiddleware,accountController.orderDetail);

router.get('/quen-mat-khau',getMenu,accountController.forgotPassword);

router.post('/send-email',accountController.sendEmailResetPassword);

router.get('/tao-moi-mat-khau/:resetPasswordToken',getMenu,accountController.resetPasswordForm);

router.post('/tao-moi-mat-khau/:resetPasswordToken',accountController.resetPassword);

router.post('/dat-hang',authRedirectMiddleware,accountController.order);

module.exports = router;
