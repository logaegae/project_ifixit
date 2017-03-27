var express = require('express');
var exRouter = express.Router();
var router = express.Router();  

var async = require('async');
var models = require('service/models');

exRouter.use("/admin/api", router);

/**
 * 관리자 로그인
 */
router.all("/login", function (req, res, next) {
	
	console.log(req.body);
	
	if(req.body.email == "admin" && req.body.password == "12344321") {
		req.session.isLogin = true;
		req.session.isAdmin = false;
		res.send({
			userId : req.body.email,
			isSuccess : true,
			isAdmin : false,
			isLogin : true
		});
	}else if(req.body.email == "hpas2002" && req.body.password == "12344321!") {
		req.session.isLogin = true;
		req.session.isAdmin = true;
		res.send({
			userId : req.body.email,
			isSuccess : true,
			isAdmin : true,
			isLogin : true
		});
	} else {
		res.send({
			isSuccess : false,
			isAdmin : false,
			isLogin : false
		});
		
	}
	
});

/**
 * 관리자 로그아웃
 */
router.all("/logout", function (req, res, next) {
	req.session.isAdmin = false;
	res.redirect("/admin");
});

router.all("/*", function (req, res, next) {
	console.log(req.session.isLogin);
	if(req.session.isLogin) {
		next();
	} else {
		res.status(401).end();
	}
});


router.use(function (err, req, res, next) {
	console.log(err);
	res.status(500).send("error");
});

module.exports = exRouter;