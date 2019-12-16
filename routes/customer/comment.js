var express = require('express');
var passport =require('passport');
var router = express.Router({ mergeParams : true });
var commentController=require('../../controllers/customer/comment_controller');

router.get('/list-comment-product',commentController.listCommentProduct);

router.post('/create',commentController.addComment);

module.exports = router;