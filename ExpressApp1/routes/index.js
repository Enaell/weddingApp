'use strict';
var express = require('express');
var router = express.Router();

// timeline
//var mongodb = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function (req, res)
{

	var loggedIn = false;
	if (req.user)
		loggedIn = true;
	// render index 
	res.render('index', { url:'http://localhost:1337/', title: 'Main Page', loggedin: loggedIn });

	//render timeline 
	//var url = 'mongodb://localhost:27017';
	//mongodb.connect(url, function (err, client)
	//{
	//	var db = client.db('weddingApp');

	//	var collection = db.collection('tripSteps');

	//	collection.find({}).toArray(
	//		function (err, results)
	//		{
	//			res.render('timelineView', { title: 'Timeline', tripSteps: results });
	//			client.close();
	//		});
	//});
	//res.render('timeineView', { title: 'Timeline' });
});

module.exports = router;
