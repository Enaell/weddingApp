'use strict';
var express = require('express');
var router = express.Router();

// timeline
var mongodb = require('mongodb').MongoClient;

/* GET home page. */
router.get('/', function (req, res)
{

	var loggedIn = false;
	if (req.user)
		loggedIn = true;

	var introBoxes =
		[
			{ imgSrc: './images/img/homePage/b-icon-1.png', title: 'Notre rencontre', text: 'parc sdgsdfg de Nanjing ' },
			{ imgSrc: './images/img/homePage/b-icon-2.png', title: 'Un amour internationnal', text: 'weewr sdf asdf wertdfg  sdfg  sdfg asdf asdf sdf' },
			{ imgSrc: './images/img/homePage/b-icon-3.png', title: 'Notre Marriage', text: 'adf sdf askdlfhlkj alsdkjhf jsdfjk ddfad' }
		];

	var ourStoryBoxes =
		[
			{ imgSrc: './images/img/homePage/b-icon-1.png', title: 'Notre rencontre', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. ' },
			{ imgSrc: './images/img/homePage/b-icon-1.png', title: 'Un amour a distance', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. ' },
			{ imgSrc: './images/img/homePage/b-icon-1.png', title: 'La vie ensemble', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. ' },
			{ imgSrc: './images/img/homePage/b-icon-1.png', title: 'Notre Marriage', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. ' }
		];

	var projectBoxes =
		[
			{ imgSrc: './images/img/projects/homePage/voyage1.jpg', title: 'La lune de miel', shortText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. ' },
			{ imgSrc: './images/img/projects/homePage/maison1.jpg', title: 'Notre premier chez nous', shortText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',  text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. ' },
			{ imgSrc: './images/img/projects/homePage/mariage1.jpg', title: 'Le marriage a l\'Eglise', shortText: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit', text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud. ' }
		];


	//render timeline 
	var url = 'mongodb://localhost:27017';
	mongodb.connect(url, function (err, client)
	{
		var db = client.db('weddingApp');

		var collection = db.collection('tripSteps');

		collection.find({}).toArray(
			function (err, results)
			{
				res.render('index', {
					url: 'http://localhost:1337/',
					title: 'Main Page',
					loggedin: loggedIn,
					introBoxes: introBoxes,
					ourStoryBoxes: ourStoryBoxes,
					projectBoxes: projectBoxes,
					tripSteps: results
				});
				client.close();
			});
	});


	// render index
	//res.render('index',
	//	{
	//		url: 'http://localhost:1337/',
	//		title: 'Main Page',
	//		loggedin: loggedIn,
	//		introBoxes: introBoxes,
	//		ourStoryBoxes: ourStoryBoxes,
	//		projectBoxes: projectBoxes
	//	});

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
