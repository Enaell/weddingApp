'use strict';
var express = require('express');
var router = express.Router();

//var mongodb = require('mongodb').MongoClient;

router.use(function (req, res, next)
{
	if (!req.user)
		res.redirect('/');
	next();
});

router.get('/', function (req, res)
{
	res.render('project/projectView',
		{ title: 'Project' });
});


module.exports = router;