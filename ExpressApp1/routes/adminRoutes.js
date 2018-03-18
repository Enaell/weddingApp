'use strict';
var express = require('express');
var router = express.Router();
var mongodb = require('mongodb').MongoClient;

router.use(function (req, res, next)
{
	if (!(req.user && req.user.admin))
		res.redirect('/');
	else
		next();
});

var steps =
[
	{
		title: 'Visite de Xi\'An',
		location: 'Xi\'an (chinois: 西安 ; pinyin : Xī\'ān ; littéralement : « paix de l\'Ouest » ; EFEO Si- ngan - fou) est la capitale de la province du Shaanxi en Chine.Elle a le statut de ville sous- provinciale.Cette ville, qui a une histoire de plus de 3 100 ans, a été la capitale de la Chine et se nommait alors Chang\'an. L\'actuelle Xi\'an se classe dans les dix plus grandes villes chinoises. Elle compte plus de huit millions d\'habitants enregistrés.',
		type: 'city',
		date: '15 Aout',
		description: 'armee enterree',
		xcoordinate: '654',
		ycoordinate: '45'
	},
	{
		title: 'Grande Muraille',
		location: 'Beijing',
		type: 'monument',
		date: '14 Aout',
		description: 'La Grande Muraille1 (chinois simplifié : 长城 ; chinois traditionnel : 長城 ; pinyin : Chángchéng ; Wade : Ch\'ang²ch\'eng² ; littéralement « la longue muraille »), aussi appelé « Les Grandes Murailles » est un ensemble de fortifications militaires chinoises construites, détruites et reconstruites en plusieurs fois et à plusieurs endroits entre le IIIe siècle av. J.-C. et le XVIIe siècle pour marquer et défendre la frontière nord de la Chine. C\'est la structure architecturale la plus importante jamais construite par l’Homme à la fois en longueur, en surface et en masse.',
		xcoordinate: '2345',
		ycoordinate: '423546'
	},
	{
		title: 'Cite interdite',
		location: 'Beijing',
		type: 'monument',
		date: '13 Aout',
		description: 'La Cité interdite (chinois : 紫禁城 ; pinyin : Zǐjìnchéng), généralement appelé par les Chinois le palais ancien (故宫 / 故宮, gùgōng), également appelé musée du palais (故宫博物院 / 故宮博物院, gùgōng bówùyuàn) est le palais impérial au sein de la Cité impériale de Pékin dont la construction fut ordonnée par Yongle, troisième empereur de la dynastie Ming, et réalisée entre 1406 et 1420. Ce palais, d\'une envergure inégalée — il s\'étend sur une superficie de 72 ha — fait partie des palais les plus anciens et les mieux conservés de Chine',
		xcoordinate: '234',
		ycoordinate: '78634'
	},
	{
		title: 'Marriage',
		location: 'DongTai',
		type: 'wedding',
		date: '18 Aout',
		description: 'Marriage',
		xcoordinate: '0498',
		ycoordinate: '23458'
	},
	{
		title: 'Visite de ShangHai',
		location: 'Shanghai',
		type: 'city',
		date: '24 Aout',
		description: 'Shanghai ou Shanghaï (chinois : 上海 ; pinyin : Shànghǎi ; Wade : Shang⁴hai³ ; cantonais Jyutping : Soeng⁶hoi² ; cantonais Yale : Shanghai ; littéralement : « sur la mer », ÉFÉO : Chang-haï, prononciation ; shanghaïen : Zanhe) est la ville la plus peuplée de Chine (en population urbaine). Elle constitue aussi l\'une des plus grandes mégapoles du monde avec plus de 30,15 millions d\'habitants (20153)4. Elle se situe sur la rivière Huangpu près de l\'embouchure du Yangzi Jiang, à l\'est de la Chine.',
		xcoordinate: '349078',
		ycoordinate: '90345'
	}
];

router.get('/addTripSteps', function (req, res)
{
	var url = 'mongodb://localhost:27017';
	mongodb.connect(url, function (err, client)
	{
		var db = client.db('weddingApp');

		var collection = db.collection('tripSteps');

		collection.insertMany(steps, function (err, results)
		{
			res.send(results);
			client.close();
		});
	});
});


module.exports = router;
