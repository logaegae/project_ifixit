var express = require('express');
var exRouter = express.Router();
var router = express.Router();
var models = require('service/models');
var async = require('async');

exRouter.use("/html/src", router);



router.all(["/iphone.html", "/sony.html"], function(req, res, next){

	models.FixPrice.findAll({
		order : "partId",
		include: [{ all: true, nested: true}]
	})
	.then(function (result) {
		res.locals.prices = result;

		models.PhoneModel.findAll({
			order : "phoneId Desc",
			include: [{ all: true, nested: true}],
			order : [['phoneGroup' , 'ASC'],['phoneId' , 'ASC'],[models.FixPrice, 'partId' , 'ASC']]
		})
		.then(function (result) {
			res.locals.models = result;
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all(["/location.html", "/home.html", "/underIe8.html"], function(req, res, next){

	models.Store.findAll({
		include: [{ all: true, nested: true}],
		order : "sortNo Asc, storeId Desc"
	})
	.then(function (result) {
		res.locals.list = result;

		models.Group.findAll({
			include:  [{ all: true, nested: true}],
			order : [[models.Store, 'sortNo' , 'ASC'],[models.Store, 'storeId' , 'DESC'],[models.Store, models.AttachFile, 'seq' , 'DESC']]
		})
		.then(function (result) {
			res.locals.groups = result;
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all(["/application.html","/application_mainboard.html"], function(req, res, next){

	models.Store.findAll({
		include: [{ all: true, nested: true}],
		order : "sortNo Asc, storeId Desc"
	})
	.then(function (result) {
		res.locals.stores = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});


router.all(["/repair_request_mainboard.html"], function(req, res, next){

	// TODO STORE ID 조회

	models.Store.findOne({
		where : {storeId : req.body.storeId},
		include: [{ all: true, nested: true}]
	})
	.then(function (result) {
		res.locals.storeInfo = result;

		// 의뢰서 INSERT
		models.RepairMainboard.create(req.body)
		.then(function (result) {
			next();
		})

		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all(["/print.html"], function(req, res, next){

	models.Store.findOne({
		where : {storeId : req.body.storeId},
		include: [{ all: true, nested: true}]
	})
	.then(function (result) {
		res.locals.storeInfo = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all(["/print_mainboard.html"], function(req, res, next){

	models.Store.findOne({
		where : {storeId : req.body.storeId},
		include: [{ all: true, nested: true}]
	})
	.then(function (result) {
		res.locals.storeInfo = result;
		next();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all(["/repair_request.html"], function(req, res, next){


	// TODO STORE ID 조회

	models.Store.findOne({
		where : {storeId : req.body.storeId},
		include: [{ all: true, nested: true}]
	})
	.then(function (result) {
		res.locals.storeInfo = result;

		// 의뢰서 INSERT

		var data = req.body;

		if(Array.isArray(data.requirement)) {
			var str = "";
			for(i=0;i<data.requirement.length;i++) {
				if(i>0) {
					str += "|";
				}
				str += data.requirement[i];
			}
			data.requirement = str;
		}

		models.RepairPhone.create(data)
		.then(function (result) {
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all("/location_detail.html", function(req, res, next){

	models.Store.findOne({
		where : {storeId : req.query.storeId},
		include: [{ all: true, nested: true}],
		order : [[models.AttachFile, 'seq' , 'DESC']]
	})
	.then(function (result) {
		res.locals.store = result;


		models.Contact.findAll({
			where : {storeId : req.query.storeId},
			order : "contactId Desc",
			include: [{ all: true, nested: true}],
			offset : 0,
			limit : 10
		})
		.then(function (result) {
			res.locals.list = result;
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});

	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});



router.all("/contact.html", function(req, res, next){


	var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

	async.series([
		function(callback) {
			models.Contact.count({})
			.then(function (result) {
				callback(null, result);
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		},//조회수 DB문

		function(callback) {


			models.Contact.findAll({
				include: [{ all: true, nested: true}],
				offset : (page-1)*pageSize,
				limit : pageSize,
				order : [['contactId' , 'DESC']]
			})
			.then(function (result) {
				callback(null, result);
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		} //리스트 DB문

	], function (err, result) {
		if(err) next(err);
		res.locals.totalCount = result[0];
		res.locals.list = result[1];
		res.locals.currentPage = page;
		res.locals.pageSize = pageSize;
		next();
	});
});


router.all("/contact_write.html", function(req, res, next){

	models.Store.findAll({order : 'sortNo ASC , storeId DESC'})
	.then(function (result) {
		res.locals.stores = result;



		models.PhoneModel.findAll({
			order : "phoneGroup ASC, phoneId Desc",
			raw : true
		})
		.then(function (result2) {
			console.log(result2);
			res.locals.models = result2;
			next();
		})
		.catch(function (err) {
			process.nextTick(function () {throw err});
		});
		
	})

	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/writeContact", function(req, res, next){

	var data = req.body;
	data.registDate = new Date();

	models.Contact.create(data)
	.then(function (result) {
		res.redirect("./contact.html");
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});




router.all("/notice.html", function(req, res, next){


	var page = req.query.page ? parseInt(req.query.page) : 1;
	var pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;

	async.series([
		function(callback) {
			models.Board.count({
				where : {boardId : 'notice'}
			})
			.then(function (result) {
				callback(null, result);
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		},//조회수 DB문

		function(callback) {


			models.Board.findAll({
				where : {boardId : 'notice'},
				order : "boardSeq Desc",
				offset : (page-1)*pageSize,
				limit : pageSize
			})
			.then(function (result) {
				callback(null, result);
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		} //리스트 DB문

	], function (err, result) {
		if(err) next(err);
		res.locals.totalCount = result[0];
		res.locals.list = result[1];
		res.locals.currentPage = page;
		res.locals.pageSize = pageSize;
		next();
	});
});

router.all("/*.html", function(req, res, next){
	var path = req.originalUrl.substring(1,req.originalUrl.indexOf(".html"));
	var paths = path.split("/");


	var ua = req.headers['user-agent'],
    deviceInfo = {};

	if (/mobile/i.test(ua))
		deviceInfo.Mobile = true;

	if (/like Mac OS X/.test(ua)) {
	    deviceInfo.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
	    deviceInfo.iPhone = /iPhone/.test(ua);
	    deviceInfo.iPad = /iPad/.test(ua);
	}

	if (/Android/.test(ua))
	    deviceInfo.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

	if (/webOS\//.test(ua))
	    deviceInfo.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

	if (/(Intel|PPC) Mac OS X/.test(ua))
	    deviceInfo.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

	if (/Windows NT/.test(ua))
	    deviceInfo.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

	var isReal = false;
	if(req.headers.host.indexOf("ifixitkor.com") > -1 || (req.headers['x-forwarded-host'] && req.headers['x-forwarded-host'].indexOf("ifixitkor.com") > -1) ) {
		isReal = true;
	}
	res.render(paths[paths.length-1], {
		deviceInfo : deviceInfo,
		menuUrl : req.path.substring(1),
		session : req.session,
		query : req.query,
		body : req.body,
		isReal : isReal
	});
});

module.exports = exRouter;
