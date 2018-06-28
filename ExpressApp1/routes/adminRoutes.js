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

//agenda take everything but type:'city' and timeline everything < 4 (wedding city and visiting/attempt a show)

// priority = importance of an event. WEDDING = 1, city = 2, visiting / attempt a show = 3, optionnal activity = 4, lunch/dinner/hotel = 5, transport = 6   
// title = big title
// location = place/city where the activity takes place
// type = kind of activity
// date = isoString of beginning time
// duration = duration of the activity in hour
// description = description in detail of the activity
// x and y coordinate are for fun if I need

var timeZoneOffSet = (new Date()).getTimezoneOffset() / -60

var steps =
	[
		{
			priority: 2,
			title: 'Pékin',
			location: 'Beijing',
			type: 'city',
			date: (new Date(2018, 7, 11, 10 + timeZoneOffSet)).toISOString(),
			daynumber: 1,
			description: 'Pékin2(en chinois : 北京 ; pinyin: běijīng, littéralement « capitale du nord »), également appelée Beijing, est la capitale de la République populaire de Chine.Située dans le nord du pays, la municipalité de Pékin (北京市, abrégé en 北京), d\'une superficie de 16 800 km2, borde la province du Hebei ainsi que la municipalité de Tianjin. Pékin est considérée comme le centre politique et culturel de la Chine, tandis que Hong Kong et Shanghai dominent au niveau économique.',
			duration: 72,
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: 'Pekin.jpg'
		},
		{
			priority: 3,
			title: 'Place Tian An Men',
			location: 'Beijing',
			type: 'monument',
			date: (new Date(2018, 7, 11, 14 + timeZoneOffSet)).toISOString(),
			daynumber: 1,
			description: 'La place Tian\'anmen (chinois simplifié : 天安门广场 ; chinois traditionnel : 天安門廣場 ; pinyin: Tiān\'ānmén Guǎngchǎng ; littéralement : « place de la porte de la Paix céleste ») est une place située au centre de Pékin. Elle s’appelle ainsi car elle se trouve immédiatement au sud de la porte de la Paix céleste (chinois simplifié : 天安门 ; pinyin : Tiān\'ānmén) qui commandait l’entrée sud de la cité impériale.',
			duration: 2,
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: 'Tian An Men.jpg'
		},
		{
			priority: 4,
			title: 'Visite libre Autour de la Place Tian An Men',
			location: 'Beijing',
			type: 'optionalVisit',
			date: (new Date(2018, 7, 11, 16 + timeZoneOffSet)).toISOString(),
			daynumber: 1,
			description: 'Temple des lamas, mausolée. etc ...',
			duration: 2,
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: 'Tian An Men.jpg'
		},
		{
			priority: 3,
			title: 'Palais d\'Ete',
			location: 'Beijing',
			type: 'monument',
			date: (new Date(2018, 7, 12, 9 + timeZoneOffSet)).toISOString(),
			daynumber: 2,
			duration: 3,
			description: 'Le Palais d\'Été (chinois simplifié : 颐和园 ; chinois traditionnel : 頤和園 ; pinyin: yíhéyuán ; littéralement: « Jardins de l\'harmonie préservée ») est un palais situé à Pékin, en république populaire de Chine.Il a été construit par l\'impératrice Cixi à partir de 1886 non loin de l\'ancien Palais d\'Été incendié en octobre 1860 par le corps expéditionnaire franco-anglais lors de la seconde guerre de l\'opium.',
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: 'Palais dete.jpg'
		},
		{
			priority: 3,
			title: 'Temple du Ciel',
			location: 'Beijing',
			type: 'monument',
			date: (new Date(2018, 7, 12, 14 + timeZoneOffSet)).toISOString(),
			daynumber: 2,
			duration: 3,
			description: 'La Grande Muraille1 (chinois simplifié : 长城 ; chinois traditionnel : 長城 ; pinyin : Chángchéng ; Wade : Ch\'ang²ch\'eng² ; littéralement « la longue muraille »), aussi appelé « Les Grandes Murailles » est un ensemble de fortifications militaires chinoises construites, détruites et reconstruites en plusieurs fois et à plusieurs endroits entre le IIIe siècle av. J.-C. et le XVIIe siècle pour marquer et défendre la frontière nord de la Chine. C\'est la structure architecturale la plus importante jamais construite par l’Homme à la fois en longueur, en surface et en masse.',
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: 'temple du ciel.jpg'
		},
		{
			priority: 3,
			title: 'Spectacle',
			location: 'Beijing',
			type: 'show',
			date: (new Date(2018, 7, 12, 20 + timeZoneOffSet)).toISOString(),
			daynumber: 2,
			duration: 2,
			description: 'Spectacle',
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: ''
		},
		{
			priority: 3,
			title: 'Tombeau des Ming',
			location: 'Beijing',
			type: 'monument',
			date: (new Date(2018, 7, 13, 9 + timeZoneOffSet)).toISOString(),
			daynumber: 3,
			duration: 2,
			description: 'Sur les seize empereurs de la dynastie, treize sont enterrés dans une nécropole. Cela représente le plus grand nombre d\'empereurs dans une nécropole impériale chinoise.C\'est le troisième empereur Ming, Yongle, l’initiateur du projet et qui repose au milieu de la nécropole. Le culte des ancêtres faisant partie intégrante des traditions, les tombeaux sont donc très importants dans la culture chinoise. D\'après les rites des Ming, on traite les morts comme les vivants. Les morts ont toujours leurs âmes qui existent et ont encore des besoins comme les vivants. Ainsi, les bâtiments des tombeaux sont des palais impériaux en plus petits avec le mur rouge (symbolisant la terre) et les tuiles jaunes (symbolisant le ciel) signifiant la place supérieure de l\'empereur et son pouvoir.',
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: 'tombeau des ming.jpg'
		},
		{
			priority: 3,
			title: 'Cite interdite',
			location: 'Beijing',
			type: 'monument',
			date: (new Date(2018, 7, 13, 14 + timeZoneOffSet)).toISOString(),
			daynumber: 3,
			duration: 3,
			description: 'La Cité interdite (chinois : 紫禁城 ; pinyin : Zǐjìnchéng), généralement appelé par les Chinois le palais ancien (故宫 / 故宮, gùgōng), également appelé musée du palais (故宫博物院 / 故宮博物院, gùgōng bówùyuàn) est le palais impérial au sein de la Cité impériale de Pékin dont la construction fut ordonnée par Yongle, troisième empereur de la dynastie Ming, et réalisée entre 1406 et 1420. Ce palais, d\'une envergure inégalée — il s\'étend sur une superficie de 2 ha — fait partie des palais les plus anciens et les mieux conservés de Chine',
			xcoordinate: '234',
			ycoordinate: '78634',
			imageUrl: 'cite interdite.jpg'
		},
		{
			priority: 3,
			title: 'Spectacle',
			location: 'Beijing',
			type: 'show',
			date: (new Date(2018, 7, 13, 20 + timeZoneOffSet)).toISOString(),
			daynumber: 3,
			duration: 2,
			description: 'Spectacle',
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: ''
		},
		{
			priority: 3,
			title: 'Grande Muraille',
			location: 'Beijing',
			type: 'monument',
			date: (new Date(2018, 7, 14, 10 + timeZoneOffSet)).toISOString(),
			daynumber: 4,
			duration: 6,
			description: 'La Grande Muraille1 (chinois simplifié : 长城 ; chinois traditionnel : 長城 ; pinyin : Chángchéng ; Wade : Ch\'ang²ch\'eng² ; littéralement « la longue muraille »), aussi appelé « Les Grandes Murailles » est un ensemble de fortifications militaires chinoises construites, détruites et reconstruites en plusieurs fois et à plusieurs endroits entre le IIIe siècle av. J.-C. et le XVIIe siècle pour marquer et défendre la frontière nord de la Chine. C\'est la structure architecturale la plus importante jamais construite par l’Homme à la fois en longueur, en surface et en masse.',
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: 'grande muraille.jpg'
		},
		{
			priority: 4,
			title: 'Train de nuit pour Xi\'An',
			location: 'Beijing',
			type: 'transport',
			date: (new Date(2018, 7, 14, 19 + timeZoneOffSet)).toISOString(),
			daynumber: 4,
			duration: 5,
			description: 'Train de nuit',
			xcoordinate: '2345',
			ycoordinate: '423546',
			imageUrl: 'xi an.jpg'
		},
		{
			priority: 2,
			title: 'Xi\'An',
			location: 'Xi\'An',
			type: 'city',
			date: (new Date(2018, 7, 15, 8 + timeZoneOffSet)).toISOString(),
			daynumber: 5,
			duration: 48,
			description: 'Xi\'an (chinois: 西安 ; pinyin : Xī\'ān ; littéralement : « paix de l\'Ouest » ; EFEO Si- ngan - fou) est la capitale de la province du Shaanxi en Chine.Elle a le statut de ville sous- provinciale.Cette ville, qui a une histoire de plus de 3 100 ans, a été la capitale de la Chine et se nommait alors Chang\'an. L\'actuelle Xi\'an se classe dans les dix plus grandes villes chinoises. Elle compte plus de huit millions d\'habitants enregistrés.',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'xi an.jpg'
		},
		{
			priority: 3,
			title: 'Armee enterree',
			location: 'Xi\'An',
			type: 'monument',
			date: (new Date(2018, 7, 15, 10 + timeZoneOffSet)).toISOString(),
			daynumber: 5,
			duration: 5,
			description: 'Xi\'an (chinois: 西安 ; pinyin : Xī\'ān ; littéralement : « paix de l\'Ouest » ; EFEO Si- ngan - fou) est la capitale de la province du Shaanxi en Chine.Elle a le statut de ville sous- provinciale.Cette ville, qui a une histoire de plus de 3 100 ans, a été la capitale de la Chine et se nommait alors Chang\'an. L\'actuelle Xi\'an se classe dans les dix plus grandes villes chinoises. Elle compte plus de huit millions d\'habitants enregistrés.',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'armee enteree.jpg'
		},
		{
			priority: 3,
			title: 'Pagode de l\'Oie Sauvage',
			location: 'Xi\'An',
			type: 'monument',
			date: (new Date(2018, 7, 15, 17 + timeZoneOffSet)).toISOString(),
			daynumber: 5,
			duration: 2,
			description: 'La Grande pagode de l\'oie sauvage (chinois simplifié : 大雁塔 ; pinyin: Dàyàn Tǎ), est une pagode située dans la partie sud de Xi\'an, dans la province chinoise du Shaanxi. Elle a été construite en 652, pendant la dynastie Tang et avait à l\'origine cinq étages.Elle a été reconstruite en 704, pendant le règne de l\'impératrice Wu Zetian et sa façade en briques a été restaurée pendant la dynastie Ming. Une de ses nombreuses fonction fut d\'abriter les sûtras et les figurines du Bouddha rapportées d\'Inde en Chine par le voyageur et traducteur bouddhiste Xuanzang.',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'pagode de loie sauvage.jpg'
		},
		{
			priority: 3,
			title: 'Muraille de Xi\'An',
			location: 'Xi\'An',
			type: 'monument',
			date: (new Date(2018, 7, 16, 9 + timeZoneOffSet)).toISOString(),
			daynumber: 6,
			duration: 2,
			description: 'Les remparts de Xi\'an, une des anciennes capitales de la Chine, sont un des ensembles de remparts les plus anciens et les mieux conservés de Chine. La construction des premiers remparts de la ville (qui s\'appelait alors « Chang\'an ») a commencé en 194 avant Jésus- Christ et s\'est étendue sur plusieurs années. Ce mur mesurait 25,7 km de long et 12 à 16 m d\'épaisseur à la base. La superficie qui était délimitée par le mur est estimée à 36 km2. Le mur qui existe actuellement a été commencé sous la dynastie Ming en 1370. Il délimite une surface bien plus petite : 14 km2. Le mur mesure 13,7 km de circonférence, 12 m de hauteur et 15 à 18 m d\'épaisseur à la base1.',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'muraille-de-Xi’an.jpg'
		},
		{
			priority: 6,
			title: 'Train rapide vers NanJing',
			location: 'Xi\'An',
			type: 'transport',
			date: (new Date(2018, 7, 16, 13 + timeZoneOffSet)).toISOString(),
			daynumber: 6,
			duration: 5,
			description: 'Train rapide',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'nanjing.jpg'
		},
		{
			priority: 2,
			title: 'NanJing',
			location: 'NanJing',
			type: 'city',
			date: (new Date(2018, 7, 16, 18 + timeZoneOffSet)).toISOString(),
			daynumber: 6,
			duration: 20,
			description: 'Nankin ou Nanjing ([Écoutez] chinois : 南京 ; pinyin : nánjīng ; EFEO : Nanking ; zhuyin : ㄋㄢˊ ㄐㄧㄥ ; littéralement : « capitale du Sud », à mettre en rapport à Pékin, 北京, běijīng, « capitale du Nord »), immédiatement en amont du delta du Yangzi Jiang, le premier fleuve chinois, est la capitale de la province chinoise du Jiangsu. La ville compte aujourd\'hui plus de huit millions d\'habitants. Elle a joué un rôle considérable dans l\'histoire chinoise. La prise de la ville par les Japonais en 1937 s\'accompagna d\'un massacre dont l\'ampleur n\'est pas connue avec certitude.',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'nanjing.jpg'
		},
		{
			priority: 4,
			title: 'visite rapide NanJing',
			location: 'NanJing',
			type: 'optionalVisit',
			date: (new Date(2018, 7, 16, 20 + timeZoneOffSet)).toISOString(),
			daynumber: 6,
			duration: 4,
			description: 'Visite du temple de confusius, vieille ville, soirée bar/boite de nuit',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'confucius-temple.jpg'
		},
		{
			priority: 3,
			title: 'Parc du lac XuanWu',
			location: 'NanJing',
			type: 'monument',
			date: (new Date(2018, 7, 17, 10 + timeZoneOffSet)).toISOString(),
			daynumber: 7,
			duration: 2,
			description: 'Le lac Xuanwu est un lac chinois d\'une superficie de 4, 44 km2 qui se trouve sur le territoire de la ville de Nankin, dans la province du Jiangsu.',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'lac xuan wu.jpg'
		},
		{
			priority: 6,
			title: 'Bus vers DongTai, ville du mariage',
			location: 'DongTai',
			type: 'transport',
			date: (new Date(2018, 7, 17, 14 + timeZoneOffSet)).toISOString(),
			daynumber: 7,
			duration: 3,
			description: 'Bus vers DongTai, ville du mariage',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'dong tai.jpg'
		},
		{
			priority: 2,
			title: 'DongTai',
			location: 'DongTai',
			type: 'city',
			date: (new Date(2018, 7, 17, 17 + timeZoneOffSet)).toISOString(),
			daynumber: 7,
			duration: 2,
			description: 'Dongtai (东台 ; pinyin : Dōngtái) est une ville de la province du Jiangsu en Chine. C\'est une ville-district placée sous la juridiction de la ville-préfecture de Yancheng.',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'dong tai.jpg'
		},
		{
			priority: 3,
			title: 'Repas avec Famille/amis du Lulu',
			location: 'DongTai',
			type: 'dinner',
			date: (new Date(2018, 7, 17, 18 + timeZoneOffSet)).toISOString(),
			daynumber: 7,
			duration: 2,
			description: 'Dinner typique',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: ''
		},
		{
			priority: 1,
			title: 'Mariage',
			location: 'DongTai',
			type: 'wedding',
			date: (new Date(2018, 7, 18, 10 + timeZoneOffSet)).toISOString(),
			daynumber: 8,
			duration: 14,
			description: 'divers activité, ceremonie et repas de Mariage',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'marriage.jpg'
		},
		{
			priority: 6,
			title: 'Bus vers Wuxi',
			location: 'DongTai',
			type: 'transport',
			date: (new Date(2018, 7, 19, 11 + timeZoneOffSet)).toISOString(),
			daynumber: 9,
			duration: 2,
			description: 'Bus vers Wuxi',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'wuxi.jpg'
		},
		{
			priority: 2,
			title: 'Wuxi',
			location: 'WuXi',
			type: 'city',
			date: (new Date(2018, 7, 19, 13 + timeZoneOffSet)).toISOString(),
			daynumber: 9,
			duration: 2,
			description: 'Wuxi (chinois simplifié 无锡, traditionnel 無錫, pinyin Wúxī, anciennes transcriptions Wu-hsi, Wuhsi, or Wusih; lit. « sans étain ») est une vieille ville industrielle de la province du Jiangsu en Chine. Séparée en deux par le lac Tai Hu, Wuxi a pour voisins Changzhou à l\'ouest et Suzhou à l\'est. Au nord se situent Taizhou et le fleuve Yangtze.Le sud a pour frontière la province du Zhejiang.Grâce à son récent développement, Wuxi, qui compte désormais plus de 6 millions d\'habitants, est parfois surnommée « la petite Shanghai ».',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'wuxi.jpg'
		},
		{
			priority: 3,
			title: 'Visite de la vieille ville',
			location: 'WuXi',
			type: 'monument',
			date: (new Date(2018, 7, 19, 15 + timeZoneOffSet)).toISOString(),
			daynumber: 9,
			duration: 2,
			description: 'Vielle ville',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'wuxi.jpg'
		},
		{
			priority: 4,
			title: 'visite rapide WuXi',
			location: 'WuXi',
			type: 'optionalVisit',
			date: (new Date(2018, 7, 19, 19 + timeZoneOffSet)).toISOString(),
			daynumber: 9,
			duration: 4,
			description: 'repos, lac, bar',
			xcoordinate: '654',
			ycoordinate: '45',
			imageUrl: 'wuxi.jpg'
		},
		{
			priority: 3,
			title: 'Grand Boudha de Ling Shan',
			location: 'WuXi',
			type: 'monument',
			date: (new Date(2018, 7, 20, 9 + timeZoneOffSet)).toISOString(),
			daynumber: 10,
			duration: 2,
			description: 'Le Grand Bouddha de Ling Shan (en chinois 靈山大佛) est une statue de 88 mètres de haut, 9e plus grande statue au monde. Elle se situe sur la colline Linshan près de la montagne Maji, non loin de la ville de Wuxi dans la province de Jiangsu. Le Grand Bouddha de Ling Shan représente le Bouddha Gautama, dit Shākyamuni.Debout, elle adopte la position dite « mudrā vitarka », comme la statue Ushiku Daibutsu, au Japon, ou celle du Bouddha du Temple du Printemps, en Chine, respectivement 3e et plus grande statue au monde.',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'bouddha de ling shan.jpg'
		},
		{
			priority: 3,
			title: 'Visite d\'un vieux village aux abord de WuXi',
			location: 'WuXi',
			type: 'monument',
			date: (new Date(2018, 7, 20, 13 + timeZoneOffSet)).toISOString(),
			daynumber: 10,
			duration: 3,
			description: 'Visite d\'un vieux village aux abord de WuXi',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'wuxi.jpg'
		},
		{
			priority: 6,
			title: 'Bus vers HuangShan/Les Montagnes Jaunes',
			location: 'Wuxi',
			type: 'transport',
			date: (new Date(2018, 7, 21, 9 + timeZoneOffSet)).toISOString(),
			daynumber: 11,
			duration: 2,
			description: 'Bus vers HuangShan/Les Montagnes Jaunes',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'huang shan.jpg'
		},
		{
			priority: 2,
			title: 'HuangShan',
			location: 'HuangShan',
			type: 'city',
			date: (new Date(2018, 7, 21, 12 + timeZoneOffSet)).toISOString(),
			daynumber: 11,
			duration: 2,
			description: 'Les monts Huang, ou Huangshan ou monts Jaunes (sinogrammes simplifiés 黄山  ; hanyu pinyin huángshān, littéralement « la montagne jaune ») sont un massif montagneux de l\'Anhui méridional, province de l\'est de la Chine. La région est connue pour sa beauté, qui repose sur la forme des pics de granite, sur celle tourmentée des conifères, et sur les nuages qui entourent fréquemment le massif. Cette montagne mythique change sans cesse de visage au gré des vents et des bruines... désespérant parfois les artistes qui désirent en fixer la beauté',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'huang shan.jpg'
		},
		{
			priority: 3,
			title: 'Visite d\'un village typique au pied des Montagnes Jaunes',
			location: 'HuangShan',
			type: 'monument',
			date: (new Date(2018, 7, 21, 13 + timeZoneOffSet)).toISOString(),
			daynumber: 11,
			duration: 3,
			description: 'Visite d\'un vieux village aux abord de WuXi',
			xcoordinate: '0498',
			ycoordinate: '23458',
			imageUrl: 'huang shan.jpg'
		},
		{
			priority: 3,
			title: 'Balade dans les montagnes',
			location: 'HuangShan',
			type: 'monument',
			date: (new Date(2018, 7, 22, 8 + timeZoneOffSet)).toISOString(),
			daynumber: 12,
			duration: 8,
			description: 'Huangshan ou monts Jaunes (sinogrammes simplifiés 黄山  ; hanyu pinyin huángshān, littéralement « la montagne jaune ») sont un massif montagneux de l\'Anhui méridional, province de l\'est de la Chine. La région est connue pour sa beauté, qui repose sur la forme des pics de granite, sur celle tourmentée des conifères, et sur les nuages qui entourent fréquemment le massif. Cette montagne mythique change sans cesse de visage au gré des vents et des bruines... désespérant parfois les artistes qui désirent en fixer la beauté',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'huang shan.jpg'
		},
		{
			priority: 3,
			title: 'Emerald Valley, Fěicuì gǔ',
			location: 'HuangShan',
			type: 'monument',
			date: (new Date(2018, 7, 23, 9 + timeZoneOffSet)).toISOString(),
			daynumber: 13,
			duration: 3,
			description: 'Huangshan ou monts Jaunes (sinogrammes simplifiés 黄山  ; hanyu pinyin huángshān, littéralement « la montagne jaune ») sont un massif montagneux de l\'Anhui méridional, province de l\'est de la Chine. La région est connue pour sa beauté, qui repose sur la forme des pics de granite, sur celle tourmentée des conifères, et sur les nuages qui entourent fréquemment le massif. Cette montagne mythique change sans cesse de visage au gré des vents et des bruines... désespérant parfois les artistes qui désirent en fixer la beauté',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'huangshan-emerald-valley.jpg'
		},
		{
			priority: 6,
			title: 'Bus vers ShangHai',
			location: 'HuangShan',
			type: 'transport',
			date: (new Date(2018, 7, 23, 13 + timeZoneOffSet)).toISOString(),
			daynumber: 13,
			duration: 3,
			description: 'Bus vers ShangHai',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'shanghai.jpg'
		},
		{
			priority: 2,
			title: 'ShangHai',
			location: 'Shanghai',
			type: 'city',
			date: (new Date(2018, 7, 23, 17 + timeZoneOffSet)).toISOString(),
			daynumber: 13,
			duration: 48,
			description: 'Shanghai ou Shanghaï (chinois : 上海 ; pinyin : Shànghǎi ; Wade : Shang⁴hai³ ; cantonais Jyutping : Soeng⁶hoi² ; cantonais Yale : Shanghai ; littéralement : « sur la mer », ÉFÉO : Chang-haï, prononciation ; shanghaïen : Zanhe) est la ville la plus peuplée de Chine (en population urbaine). Elle constitue aussi l\'une des plus grandes mégapoles du monde avec plus de 30,15 millions d\'habitants (20153)4. Elle se situe sur la rivière Huangpu près de l\'embouchure du Yangzi Jiang, à l\'est de la Chine.',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'shanghai.jpg'
		},
		{
			priority: 4,
			title: 'visite rapide ShangHai/le Bund',
			location: 'Shanghai',
			type: 'optionalVisit',
			date: (new Date(2018, 7, 23, 19 + timeZoneOffSet)).toISOString(),
			daynumber: 13,
			duration: 2,
			description: 'Visite nocturne, magasin, bar, etc...',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'shanghai.jpg'
		},
		{
			priority: 3,
			title: 'Tour de la Perle d\'Orient',
			location: 'Shanghai',
			type: 'monument',
			date: (new Date(2018, 7, 24, 10 + timeZoneOffSet)).toISOString(),
			daynumber: 14,
			duration: 2,
			description: 'La Perle de l\'Orient (东方明珠电视塔) est une tour de télévision située à Shanghai en République populaire de Chine. Elle est située dans le quartier d\'affaires de Lujiazui dans le district de Pudong près de la rivière Huangpu, face au Bund sur l\'autre rive.',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'shanghai-perle-de-lorient.jpg'
		},
		{
			priority: 3,
			title: 'Visite de la vieille ville',
			location: 'Shanghai',
			type: 'monument',
			date: (new Date(2018, 7, 24, 13 + timeZoneOffSet)).toISOString(),
			daynumber: 14,
			duration: 4,
			description: 'visite de la vieille ville',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'shanghai vieille ville.jpg'
		},
		{
			priority: 3,
			title: 'Temple de Jing An',
			location: 'Shanghai',
			type: 'monument',
			date: (new Date(2018, 7, 24, 17 + timeZoneOffSet)).toISOString(),
			daynumber: 14,
			duration: 1,
			description: 'Le temple de Jing\'an (en chinois 静安寺, en pinyin Jìng\'ānsì, mot-à-mot : « Temple de la Paix et de la Tranquillité ») est un temple bouddhiste situé sur la Rue de Nankin dans le district de Jing\'an, à Shanghai.Il fut fondé en 247 apr. J.-C., durant la période des Trois Royaumes.Shanghaï se trouvait alors dans le Royaume de Wu.Situé à l\'origine près de la rivière Suzhou, il fut transféré sur le site actuel en 1216 sous la dynastie Song. La structure actuelle du temple date de la dynastie Qing (1644-1911).',
			xcoordinate: '349078',
			ycoordinate: '90345',
			imageUrl: 'shanghai vieille ville.jpg'
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
