﻿'use strict';
var express = require('express');
var router = express.Router();

var mongodb = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

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

		var collection = db.collection('projects');

		collection.find({}).toArray(
			function (err, results)
			{
				res.render('project/projectView',
					{ title: 'Project', projects: results });
				client.close();
			});
	});
	//res.render('timelineView', { title: 'Timeline' });
});


//router.get('/', function (req, res)
//{
//	res.render('project/projectView',
//		{ title: 'Project' });
//});

router.get('/projectpicture/:filename', function (req, res)
{
	//	console.log(__dirname)
	//	console.log(__dirname + '\\..\\public\\images\\img\\timeline\\events\\' + req.params.filename);
	//	res.sendFile('C:\\Users\\oreli\\Documents\\Visual Studio 2017\\Projects\\ExpressApp1\\ExpressApp1\\public\\images\\img\\timeline\\events\\' + req.params.filename);
	res.sendFile(__dirname.replace('\\routes', '\\public\\images\\img\\projects\\items\\') + req.params.filename);
});

router.get('/projectpicture/:directoryname/:filename', function (req, res)
{

	//	console.log(__dirname)
	//	console.log(__dirname + '\\..\\public\\images\\img\\timeline\\events\\' + req.params.filename);
	//	res.sendFile('C:\\Users\\oreli\\Documents\\Visual Studio 2017\\Projects\\ExpressApp1\\ExpressApp1\\public\\images\\img\\timeline\\events\\' + req.params.filename);
	res.sendFile(__dirname.replace('\\routes', '\\public\\images\\img\\projects\\items\\') + req.params.directoryname + '\\' + req.params.filename);
});


router.patch('/pay/:projectNum', function (req, res)
{
	console.log(req.user);

	var projectId = req.params.projectNum;
	var url = 'mongodb://localhost:27017';
	//mongodb.connect(url, function (err, client)
	//{

	console.log('params : ' + req.params);
	console.log('body: ' + req.body);

	//});
	console.log(req.params.projectNum);

	mongodb.connect(url, function (err, client)
	{
		var db = client.db('weddingApp');

		var collection = db.collection('projects');

		var elementSearch = { _id: ObjectId(projectId) };
		var newPricePayed = { $set: req.body };

		collection.updateOne(elementSearch, newPricePayed, function (err, res)
		{
			if (err)
			{
				res.sendStatus(500);
				throw err;
			}

			console.log("project " + projectId + " price payed updated");
			client.close();
			res.sendStatus(200);
		});
	});

	
});

module.exports = router;