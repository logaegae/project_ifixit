var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var upload = require('service/upload');

exRouter.use("/admin/api/order", router);


router.all("/", function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;

	var where = {}


	if(req.body.orderStatus) {
		where.paymentStatus = req.body.orderStatus;
	}
	if(req.body.unread == "Y") {
		where.unReadContactCount = {$gt : 0}
	}

	var whereMember = {};

	if(req.body.searchText) {
		whereMember.$or = [
			{name : {$like: '%'+req.body.searchText+'%'}},
			{email : req.body.searchText},
		];
	}

	var whereProduct = {};
	if(req.body.searchProduct) {
		whereProduct.productName =  {$like : '%'+req.body.searchProduct+'%'};
	}


    models.OrderInfo.findAndCountAll({
    	where : where ,
    	order : "orderDate Desc",
    	offset : (page-1)*pageSize,
    	limit : pageSize,
    	include: [
    		{
				model : models.Member,
	    		where : whereMember
    		},
    		{
				model : models.OrderProduct,
	    		include : {model : models.Product, where : whereProduct,paranoid: false},
	    		paranoid: false
    		}
    	]

	})
	.then(function (result) {
		res.send({
			totalCount : result.count,
			list : result.rows,
			currentPage : page
		});		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});



router.all("/:orderId", function(req, res, next){

    models.OrderInfo.find({
    	where : {orderId : req.params.orderId},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		
		res.send(result);


		var data = {unReadContactCount : 0};
	    models.OrderInfo.update(data, {
	    	where : {orderId : req.params.orderId}
	    })
		.then(function (result) {
			
		})
		.catch(function (err) {
			console.log(err);
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});


});



router.all("/:orderId/update", upload.single('file'), function(req, res, next){


    models.OrderInfo.update(req.body, {
    	where : {orderId : req.params.orderId}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/:orderId/answer", function(req, res, next){


	var data = req.body;
	data.registDate = Date();

    models.OrderContact.create(data, {
    	where : {orderContactId : req.body.orderContactId}
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