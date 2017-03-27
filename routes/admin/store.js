var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var upload = require('service/upload');
var uuid = require('uuid');

exRouter.use("/admin/api/store", router);


router.all("/", function(req, res, next){

	var where = [];
	if(req.body.searchText) {
		where = ['name like ?','%'+req.body.searchText+'%'];
	}

    models.Store.findAll({
    	where : where ,
    	include: [{ all: true, nested: true}],
    	order : "sortNo Asc, storeId Desc"
	})
	.then(function (result) {
		res.send({
			list : result
		});
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});



router.all("/sort", function(req, res, next){

	async.each(req.body.list, function(data, callback) {
		
		console.log(data)

	    models.Store.update(data, {
	    	where : {storeId : data.storeId}
	    })
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


});


router.all("/insert", upload.array('file'), function(req, res, next){

	console.log(req.body);

	var data = req.body;
	data.registDate = new Date();
	
	var attachFiles = [];
	
	console.log(req.files);
	
	for(var i=0;i<req.files.length;i++) {
		var file = req.files[i];
		attachFiles.push({
			seq : i,
			filePath : '/uploads/'+file.filename,
			localPath : file.path,
			name : file.originalname,
			size : file.size
		});
	};
	
    models.Store.create(data)
	.then(function (result) {
		
		var storeId = result.dataValues.storeId;
		
		async.each(attachFiles, function(attachFile, callback) {		
			attachFile.storeId = storeId;
			models.AttachFile.create(attachFile)
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
		
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
	


});

router.all("/:storeId", function(req, res, next){

    models.Store.find({
    	where : {storeId : req.params.storeId},
    	include: [{ all: true, nested: true}]
    })
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});




});



router.all("/:storeId/update", upload.array('file'), function(req, res, next){

	console.log(req.body);
	console.log(req.file);

	var data = req.body;
	var attachFiles = [];
	
	console.log(req.files);
	
	for(var i=0;i<req.files.length;i++) {
		var file = req.files[i];
		attachFiles.push({
			storeId : req.body.storeId,
			seq : i,
			filePath : '/uploads/'+file.filename,
			localPath : file.path,
			name : file.originalname,
			size : file.size
		});
	};
	


    models.Store.update(data, {
    	where : {storeId : req.params.storeId}
    })
	.then(function (result) {
		
		console.log("---------------");
		console.log(req.body.AttachFiles.length);
		
		if(attachFiles.length > 0) {
			models.AttachFile.destroy({where : {storeId : req.body.storeId}})
			.then(function (result) {
				
				async.each(attachFiles, function(attachFile, callback) {
					models.AttachFile.create(attachFile)
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
				
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		} else {
			
			if(req.body.removeAttach == "Y") {
				models.AttachFile.destroy({where : {storeId : req.body.storeId}})
				.then(function (result) {
					res.end();
					
				})
				.catch(function (err) {
					process.nextTick(function () {throw err});
				});
			} else {
				res.end();
			}
			
		}
		


		
		
		
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});



});


router.all("/:storeId/delete", function(req, res, next){
    models.Store.destroy({
    	where : {storeId : req.params.storeId}
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