﻿'use strict';
var express = require('express');
var router = express.Router();

var mongodb = require('mongodb').MongoClient;

// block all page from this router to be shown if not connected.
router.use(function (req, res, next)
{
	if (!req.user)
		res.redirect('/');
	next();
});

router.get('/', function (req, res) 
{
	//render timeline 
	var url = 'mongodb://localhost:27017';
	mongodb.connect(url, function (err, client)
	{
		var db = client.db('weddingApp');

		var collection = db.collection('tripSteps');

		collection.find({}).toArray(
			function (err, results)
			{
				res.render('timeline/timelineView',
					{ title: 'Timeline', tripSteps: results });
				client.close();
			});
	});
	//res.render('timelineView', { title: 'Timeline' });
});

router.get('/eventpicture/:filename', function (req, res)
{

//	console.log(__dirname)
//	console.log(__dirname + '\\..\\public\\images\\img\\timeline\\events\\' + req.params.filename);
//	res.sendFile('C:\\Users\\oreli\\Documents\\Visual Studio 2017\\Projects\\ExpressApp1\\ExpressApp1\\public\\images\\img\\timeline\\events\\' + req.params.filename);
	res.sendFile(__dirname.replace('\\routes', '\\public\\images\\img\\timeline\\events\\') + req.params.filename);
});

module.exports = router;
