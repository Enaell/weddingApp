var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	mongodb = require('mongodb').MongoClient;

module.exports = function () {
	passport.use(new LocalStrategy({
		usernameField: 'signupEmail', 
//		useremailField: 'signupUsername',
		passwordField: 'signupPassword'
	},
	function (email, password, done)
	{
		var url = 'mongodb://localhost:27017';
		mongodb.connect(url, function (err, client) {
			var db = client.db('weddingApp');
			var collection = db.collection('users');
			collection.findOne({ email: email },
				function (err, results)
				{
					console.log(results);
					if (results != null && results.password === password)
					{
						var user = results;
						done(null, user);
					}
					else
						done(null, false, { message: 'Bad password' });
				}
			)
		});
	}));
}