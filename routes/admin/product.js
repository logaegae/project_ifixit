var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var upload = require('service/upload');

exRouter.use("/admin/api/product", router);


router.all("/", function(req, res, next){


	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	

	async.series([
	    function(callback) {

			var where = [];
			if(req.body.searchText) {
				where = ['productName like ?','%'+req.body.searchText+'%'];
			}
			models.Product.count({
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
				where = ['productName like ?','%'+req.body.searchText+'%'];
			}

		    models.Product.findAll({
		    	where : where ,
		    	order : "productId Desc",
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



router.all("/insert", upload.single('file'), function(req, res, next){

	console.log(req.body);

	var data = req.body;
	if(req.file) {
		data.thumbPath = '/uploads/'+req.file.filename;
		data.thumbLocalPath = req.file.path;
		data.thumbName = req.file.originalname;
		data.thumbSize = req.file.size;
	}
	data.registDate = new Date();

    models.Product.create(data)
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});

router.all("/:productId", function(req, res, next){

    models.Product.find({
    	where : {productId : req.params.productId}
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});




});



router.all("/:productId/update", upload.single('file'), function(req, res, next){

	console.log(req.body);
	console.log(req.file);

	var data = req.body;
	if(req.file) {
		data.thumbPath = '/uploads/'+req.file.filename;
		data.thumbLocalPath = req.file.path;
		data.thumbName = req.file.originalname;
		data.thumbSize = req.file.size;
	}

    models.Product.update(data, {
    	where : {productId : req.params.productId}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/:productId/delete", function(req, res, next){
    models.Product.destroy({
    	where : {productId : req.params.productId}
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