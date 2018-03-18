'use strict';
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;
var passport = require('passport');



router.post('/signUp', function (req, res) {
	console.log(req.body);

	var url = 'mongodb://localhost:27017';
	mongodb.connect(url, function (err, client)
	{
		var db = client.db('weddingApp');
		var collection = db.collection('users');
		var user = {
			username: req.body.signupUsername,
			email: req.body.signupEmail,
			password: req.body.signupPassword,
			admin: false
		};

		collection.insert(user, function (err, results) {
			req.login(results.ops[0], function () {
				res.redirect('/auth/profile');
			});
		});
	});



});

router.post('/signIn',
	passport.authenticate('local',
	{
		failureRedirect: '/'
	}),
	function (req, res) {
	res.redirect('/auth/profile');
});

router.get('/profile',
	function (req, res, next)
	{
		if (!req.user)
		{
			res.redirect('/');
		}
		next();
	} ,function (req, res)
	{
		res.json(req.user);
	});

router.get('/signout',
	function (req, res, next)
	{
		if (!req.user)
			res.redirect('/');
		next();
	},
	function (req, res)
	{
		req.logout();
		res.redirect('/');
	});

module.exports = router;
