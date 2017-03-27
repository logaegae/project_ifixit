var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');

exRouter.use("/admin/api", router);

router.all("/contact", function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;

	async.series([
	    function(callback) {

			var where = [];
			if(req.body.searchText) {
				where.push('title like ?','%'+req.body.searchText+'%');
			}
			if(req.body.storeId && req.body.storeId != '') {
				where.push('storeId = '+req.body.storeId);
			}
			models.Contact.count({
				where : where
			})
	    	.then(function (result) {
	    		callback(null, result);
	    	})
	    	.catch(function (err) {
	    		process.nextTick(function () {throw err});
	    	});
	    },
	    function(callback) {


			var where = [];
			if(req.body.searchText) {
				where.push('title like ?','%'+req.body.searchText+'%');
			}
			if(req.body.storeId && req.body.storeId != '') {
				where.push('storeId = '+req.body.storeId);
			}

		    models.Contact.findAll({
		    	where : where ,
		    	include: [{ all: true, nested: true}],
		    	order : [['replyYn','ASC'],['contactId' , 'DESC']],
		    	offset : (page-1)*pageSize,
		    	limit : pageSize
			})
	    	.then(function (result) {
	    		callback(null, result);
	    	})
	    	.catch(function (err) {
	    		process.nextTick(function () {throw err});
	    	});


	    }
	], function (err, result) {
		if(err) next(err);
		res.send({
			totalCount : result[0],
			list : result[1],
			currentPage : page
		});
	});


});


router.all("/contact/:contactId", function(req, res, next){

    models.Contact.find({
    	where : {contactId : req.params.contactId},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});


});

router.all("/contact/:contactId/update", function(req, res, next){
	
	var data = req.body;
	
	console.log(data);
	
	if(data.ContactComments.length > 0) {
		data.replyDate = new Date();
		data.replyYn = 'Y';
	}

    models.Contact.update(data, {
    	where : {contactId : req.params.contactId}
    })
	.then(function (result) {
		res.end();
		
		async.each(data.ContactComments, function(commentData, callback) {
			if(!commentData.registDate) {
				commentData.registDate = new Date();
			}
			models.ContactComment.upsert(commentData)
			.then(function (result) {
				callback();
			})
			.catch(function (err) {
				process.nextTick(function () {throw err}); 
			});
			

		}, function(err) {
			
			if(err) throw err;
			res.end();			
		});
		
		/*
		if(req.body.ContactComments.length > 0) {

		}
		*/
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/contact/:contactId/delete", function(req, res, next){

    models.Contact.destroy({
    	where : {contactId : req.params.contactId}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
    
});



router.all("/contact/:commentId/deleteComment", function(req, res, next){

    models.ContactComment.destroy({
    	where : {commentId : req.params.commentId}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
    
});

router.use(function (err, req, res, next) {
	console.log(err);
	res.status(500).send("error");
});

module.exports = exRouter;