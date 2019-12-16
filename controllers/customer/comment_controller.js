var express = require('express');
var commentModel = require('../../models/comment');

exports.listCommentProduct = async function(req,res,next){
	let page =1;
	let url = req.path+'?';
	if(req.query.page){
		page = parseInt(req.query.page);
	}
	if(req.query.productId){
		url=url+'productId='+req.query.productId+'&page=';
		let productId = req.query.productId;
		let rsCount = await commentModel.getCountCommentsProduct(productId);
		if(rsCount.error){
			return res.send({error:true,messsage:'server error'});
		}
		else{
			let count = rsCount.count;
			let rsList = await commentModel.getCommentsProduct(productId,page);
			if(rsList.error){
				return res.send({error:true,messsage:'server error'});
			}
			else{
				let pagination={totalPage:parseInt(count/10)+1,curPage:page,totalItem:count,url:url};
				return res.render('./customer/comment_list',{comments:rsList.data,pagination:pagination});
			}
		}
	}
	else{
		return res.send({error:true,messsage:'invalid params'});
	}
}

exports.addComment = async function(req,res,next){
    let comment={};
    if(req.body.productId && req.body.content){
        comment.productId = req.body.productId;
        comment.content = req.body.content;
    }
    else{
        return res.send({error:true,messsage:'invalid params'});
    }
    if(req.isAuthenticated()){
        let user = req.user;
        comment.userId = user._id;
        comment.name = user.username;   
        comment.avatar = user.avatar;
    }
    else{
        comment.userId=null;
        comment.avatar=null;
        if(req.body.name){
            comment.name = req.body.name;
        }
        else{
            return res.send({error:true,messsage:'invalid params'});
        }
    }
    let result = await commentModel.createComment(comment);
    if(!result.error){
        return res.render('./customer/layout/comment',{comment:result.data});
    }
    else{
        return res.send({error:true,messsage:'server error'});
    }
}