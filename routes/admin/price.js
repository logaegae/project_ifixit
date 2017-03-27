var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');

exRouter.use("/admin/api", router);

router.all("/price", function(req, res, next){


    models.PhoneModel.findAll({
    	where : {} ,
    	include: [{ all: true, nested: true}],    		
    	order : [['phoneGroup' , 'ASC'],['phoneId' , 'ASC'],[models.FixPrice, 'partId' , 'ASC']]
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


router.all("/price/update", function(req, res, next){
	
    models.FixPrice.destroy({
    	where : {phoneId : req.body.phoneId}
    })
	.then(function (result) {
		async.each(req.body.fixPrices, function(item, callback) {	
			item.partId = null;
			models.FixPrice.create(item)
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

router.use(function (err, req, res, next) {
	console.log(err);
	res.status(500).send("error");
});

module.exports = exRouter;