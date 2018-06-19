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

// priority = importance of an event. WEDDING = 1, city = 2, visiting / attempt a show = 3, optionnal activity = 4, lunch/dinner/hotel = 5, transport = 6   
// title = big title
// location = place/city where the activity takes place
// type = kind of activity
// date = isoString of beginning time
// duration = duration of the activity in hour
// description = description in detail of the activity
// x and y coordinate are for fun if I need


var steps =
	[
		{
			priority: 2,
			title: 'Pékin',
			location: 'Beijing',
			type: 'city',
			date: (new Date(2018, 7, 11)).toISOString(),
			description: 'Pékin2(en chinois : 北京 ; pinyin: běijīng, littéralement « capitale du nord »), également appelée Beijing, est la capitale de la République populaire de Chine.Située dans le nord du pays, la municipalité de Pékin (北京市, abrégé en 北京), d\'une superficie de 16 800 km2, borde la province du Hebei ainsi que la municipalité de Tianjin. Pékin est considérée comme le centre politique et culturel de la Chine, tandis que Hong Kong et Shanghai dominent au niveau économique.',
			duration: 72,
			xcoordinate: '2345',
			ycoordinate: '423546'
		},
		{
			priority: 3,
			title: 'Grande Muraille',
			location: 'Beijing',
			type: 'monument',
			date: (new Date(2018, 7, 14)).toISOString(),
			duration: 72,
			description: 'La Grande Muraille1 (chinois simplifié : 长城 ; chinois traditionnel : 長城 ; pinyin : Chángchéng ; Wade : Ch\'ang²ch\'eng² ; littéralement « la longue muraille »), aussi appelé « Les Grandes Murailles » est un ensemble de fortifications militaires chinoises construites, détruites et reconstruites en plusieurs fois et à plusieurs endroits entre le IIIe siècle av. J.-C. et le XVIIe siècle pour marquer et défendre la frontière nord de la Chine. C\'est la structure architecturale la plus importante jamais construite par l’Homme à la fois en longueur, en surface et en masse.',
			xcoordinate: '2345',
			ycoordinate: '423546'
		},
		{
			priority: 3,
			title: 'Cite interdite',
			location: 'Beijing',
			type: 'monument',
			date: (new Date(2018, 7, 13)).toISOString(),
			duration: 72,
			description: 'La Cité interdite (chinois : 紫禁城 ; pinyin : Zǐjìnchéng), généralement appelé par les Chinois le palais ancien (故宫 / 故宮, gùgōng), également appelé musée du palais (故宫博物院 / 故宮博物院, gùgōng bówùyuàn) est le palais impérial au sein de la Cité impériale de Pékin dont la construction fut ordonnée par Yongle, troisième empereur de la dynastie Ming, et réalisée entre 1406 et 1420. Ce palais, d\'une envergure inégalée — il s\'étend sur une superficie de 72 ha — fait partie des palais les plus anciens et les mieux conservés de Chine',
			xcoordinate: '234',
			ycoordinate: '78634'
		},
		{
			priority: 2,
			title: 'Xi\'An',
			location: 'Xi\'An',
			type: 'city',
			date: (new Date(2018, 7, 15)).toISOString(),
			duration: 72,
			description: 'Xi\'an (chinois: 西安 ; pinyin : Xī\'ān ; littéralement : « paix de l\'Ouest » ; EFEO Si- ngan - fou) est la capitale de la province du Shaanxi en Chine.Elle a le statut de ville sous- provinciale.Cette ville, qui a une histoire de plus de 3 100 ans, a été la capitale de la Chine et se nommait alors Chang\'an. L\'actuelle Xi\'an se classe dans les dix plus grandes villes chinoises. Elle compte plus de huit millions d\'habitants enregistrés.',
			xcoordinate: '654',
			ycoordinate: '45'
		},
		{
			priority: 3,
			title: 'Armee enterree',
			location: 'Xi\'An',
			type: 'city',
			date: (new Date(2018, 7, 16)).toISOString(),
			duration: 72,
			description: 'Xi\'an (chinois: 西安 ; pinyin : Xī\'ān ; littéralement : « paix de l\'Ouest » ; EFEO Si- ngan - fou) est la capitale de la province du Shaanxi en Chine.Elle a le statut de ville sous- provinciale.Cette ville, qui a une histoire de plus de 3 100 ans, a été la capitale de la Chine et se nommait alors Chang\'an. L\'actuelle Xi\'an se classe dans les dix plus grandes villes chinoises. Elle compte plus de huit millions d\'habitants enregistrés.',
			xcoordinate: '654',
			ycoordinate: '45'
		},
		{
			priority: 3,
			title: 'Pagode de l\'Oie Sauvage',
			location: 'Xi\'An',
			type: 'city',
			date: (new Date(2018, 7, 16)).toISOString(),
			duration: 72,
			description: 'La Grande pagode de l\'oie sauvage (chinois simplifié : 大雁塔 ; pinyin: Dàyàn Tǎ), est une pagode située dans la partie sud de Xi\'an, dans la province chinoise du Shaanxi. Elle a été construite en 652, pendant la dynastie Tang et avait à l\'origine cinq étages.Elle a été reconstruite en 704, pendant le règne de l\'impératrice Wu Zetian et sa façade en briques a été restaurée pendant la dynastie Ming. Une de ses nombreuses fonction fut d\'abriter les sûtras et les figurines du Bouddha rapportées d\'Inde en Chine par le voyageur et traducteur bouddhiste Xuanzang.',
			xcoordinate: '654',
			ycoordinate: '45'
		},
		{
			priority: 1,
			title: 'Marriage',
			location: 'DongTai',
			type: 'wedding',
			date: (new Date(2018, 7, 18)).toISOString(),
			duration: 72,
			description: 'Marriage',
			xcoordinate: '0498',
			ycoordinate: '23458'
		},
		{
			priority: 2,
			title: 'HuangShan',
			location: 'HuangShan',
			type: 'city',
			date: (new Date(2018, 7, 22)).toISOString(),
			duration: 72,
			description: 'Les monts Huang, ou Huangshan ou monts Jaunes (sinogrammes simplifiés 黄山  ; hanyu pinyin huángshān, littéralement « la montagne jaune ») sont un massif montagneux de l\'Anhui méridional, province de l\'est de la Chine. La région est connue pour sa beauté, qui repose sur la forme des pics de granite, sur celle tourmentée des conifères, et sur les nuages qui entourent fréquemment le massif. Cette montagne mythique change sans cesse de visage au gré des vents et des bruines... désespérant parfois les artistes qui désirent en fixer la beauté',
			xcoordinate: '349078',
			ycoordinate: '90345'
		},
		{
			priority: 3,
			title: 'Balade dans les montagnes',
			location: 'HuangShan',
			type: 'monument',
			date: (new Date(2018, 7, 23)).toISOString(),
			duration: 72,
			description: 'Huangshan ou monts Jaunes (sinogrammes simplifiés 黄山  ; hanyu pinyin huángshān, littéralement « la montagne jaune ») sont un massif montagneux de l\'Anhui méridional, province de l\'est de la Chine. La région est connue pour sa beauté, qui repose sur la forme des pics de granite, sur celle tourmentée des conifères, et sur les nuages qui entourent fréquemment le massif. Cette montagne mythique change sans cesse de visage au gré des vents et des bruines... désespérant parfois les artistes qui désirent en fixer la beauté',
			xcoordinate: '349078',
			ycoordinate: '90345'
		},
		{
			priority: 2,
			title: 'ShangHai',
			location: 'Shanghai',
			type: 'city',
			date: (new Date(2018, 7, 14)).toISOString(),
			duration: 72,
			description: 'Shanghai ou Shanghaï (chinois : 上海 ; pinyin : Shànghǎi ; Wade : Shang⁴hai³ ; cantonais Jyutping : Soeng⁶hoi² ; cantonais Yale : Shanghai ; littéralement : « sur la mer », ÉFÉO : Chang-haï, prononciation ; shanghaïen : Zanhe) est la ville la plus peuplée de Chine (en population urbaine). Elle constitue aussi l\'une des plus grandes mégapoles du monde avec plus de 30,15 millions d\'habitants (20153)4. Elle se situe sur la rivière Huangpu près de l\'embouchure du Yangzi Jiang, à l\'est de la Chine.',
			xcoordinate: '349078',
			ycoordinate: '90345'
		},
		{
			priority: 3,
			title: 'Visite de ShangHai',
			location: 'Shanghai',
			type: 'city',
			date: (new Date(2018, 7, 25)).toISOString(),
			duration: 72,
			description: 'Shanghai ou Shanghaï (chinois : 上海 ; pinyin : Shànghǎi ; Wade : Shang⁴hai³ ; cantonais Jyutping : Soeng⁶hoi² ; cantonais Yale : Shanghai ; littéralement : « sur la mer », ÉFÉO : Chang-haï, prononciation ; shanghaïen : Zanhe) est la ville la plus peuplée de Chine (en population urbaine). Elle constitue aussi l\'une des plus grandes mégapoles du monde avec plus de 30,15 millions d\'habitants (20153)4. Elle se situe sur la rivière Huangpu près de l\'embouchure du Yangzi Jiang, à l\'est de la Chine.',
			xcoordinate: '349078',
			ycoordinate: '90345'
		},
		{
			priority: 3,
			title: 'le Bund',
			location: 'Shanghai',
			type: 'monument',
			date: (new Date(2018, 7, 25)).toISOString(),
			duration: 72,
			description: 'Le Bund (terme anglo-ourdou signifiant « rive boueuse »)1 est appelé waitan - 外灘 - par les Chinois signifiant « la berge des étrangers »2. Boulevard de la ville de Shanghai en Chine, il est jalonné de somptueux édifices de style européen et de banques ou de compagnies coloniales des années 1930',
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
