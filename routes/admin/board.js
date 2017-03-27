var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');
var upload = require('service/upload');

exRouter.use("/admin/api/board", router);


router.all("/", function(req, res, next){
	
	var page = req.body.page ? parseInt(req.body.page) : 1;
	var pageSize = req.body.pageSize ? parseInt(req.body.pageSize) : 10;
	
	async.series([
		function(callback) {
			var where = [];
//			if(req.body.searchText) {
//				where.push('title like ?');
//				where.push('%'+req.body.searchText+'%');
//			}
//			if(req.body.searchText) {
//				where.push('boardId = ?');
//				where.push(req.body.boardId);	
//			}
			if(req.body.searchText) {
				if(req.body.boardId) {
					where = ['boardId= ? AND title like ?', req.body.boardId,'%'+req.body.searchText+'%'];
				} else {
					where = ['title like ?', '%'+req.body.searchText+'%'];
				}
			} else {
				if(req.body.boardId) {
					where = ['boardId= ?', req.body.boardId];
				}
			}
			models.Board.count({
				where : where
			})
			.then(function (result) {
				callback(null, result);
			})
			.catch(function (err) {
				process.nextTick(function () {throw err});
			});
		},//조회수 DB문
		
		function(callback) {
			
			var where = [];

			if(req.body.searchText) {
				if(req.body.boardId) {
					where = ['boardId= ? AND title like ?', req.body.boardId,'%'+req.body.searchText+'%'];
				} else {
					where = ['title like ?', '%'+req.body.searchText+'%'];
				}
			} else {
				if(req.body.boardId) {
					where = ['boardId= ?', req.body.boardId];
				}
			}
			
			models.Board.findAll({
				where : where ,
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
	
	models.Board.create(data)
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:boardSeq", function(req, res, next) {
	
	models.Board.find({
		where : {boardSeq : req.params.boardSeq}
	})
	.then(function (result) {
		res.send(result);
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});

router.all("/:boardSeq/update", upload.single('file'), function(req, res, next){

	console.log(req.body);
	console.log(req.file);

	var data = req.body;

    models.Board.update(data, {
    	where : {boardSeq : req.params.boardSeq}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});

});

router.all("/:boardSeq/delete", function(req, res, next){
    models.Board.destroy({
    	where : {boardSeq : req.params.boardSeq}
    })
	.then(function (result) {
		res.end();
	})
	.catch(function (err) {
		process.nextTick(function () {throw err});
	});
});



module.exports = exRouter;