//jQuery(document).ready(function ($)
//{
	var container = document.getElementById("mainSection");

	var contentSections = $('#homePage section');
	var verticalNavigation = $('.vertical-nav');
	var navigationItems = verticalNavigation.find('a');
	var scrollArrow = $('.scroll-down');

	//smooth scroll to the selected section

	var canScroll = true;
	var portfolioIsShown = false;
	var newsBoxIsShown = [];
	$('.news-box').each(function ()
	{
		newsBoxIsShown.push(false);
	});

	// set locale time in timeline date
	$('#homePageTimeline.timeline .timeline-content .date').each(function ()
	{
		$(this).html((new Date($(this).html())).toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
	});

	function mainSectionSmoothScroll(distance, direction)
	{
		var minDistance = 0;

		if (distance > 5)
		{
			minDistance = Math.min(40, distance / 5);

			container.scrollTop += (minDistance * direction);
			distance -= minDistance;
			setTimeout(function () { mainSectionSmoothScroll(distance, direction); }, 10);
		}
		else
			canScroll = true;
	}


	verticalNavigation.on('click', 'a', function (event)
	{
		var target = $(this.hash);
		event.preventDefault();
		var offset = target.offset().top;
		var direction = 1;

		if (target.offset().top < 0)
		{
			offset *= -1;
			direction *= -1;
		}

		offset += (50 * direction);

		if (canScroll)
		{
			canScroll = false;
			mainSectionSmoothScroll(offset, direction);
		}

		verticalNavigation.removeClass('open');
	});



	function updateSections()
	{
		var halfWindowHeight = $(window).height() / 2;
		//		var scrollTop = $(window).scrollTop();
		var scrollTop = container.scrollTop;

		var activeSectionFound = false;

		$(contentSections.get().reverse()).each(function ()
		{
			var section = $(this),
				sectionId = section.attr('id'),
				navigationItem = navigationItems.filter('[href^="#' + sectionId + '"]');

			if (activeSectionFound || section.offset().top > halfWindowHeight)
				navigationItem.removeClass('active');
			else
			{
				navigationItem.addClass('active');
				activeSectionFound = true;
			}
		});
	}

	container.addEventListener('ps-scroll-y', function () 
	{
		$('#homePage #homePageVerticalNav').offset({ top: 0, left: $('#homePage #homePageVerticalNav').offset.left });
		updateSections();

		if (!portfolioIsShown && $('#portfolio').offset().top < $(window).height() * 3 / 4)
		{
			showPortfolio();
			portfolioIsShown = true;
		}

		$('#homePage .timeline-block').each(function()
		{
			if ($(this).find('.timeline-img').hasClass('is-hidden') && $(this).offset().top < $(window).height() * 3 / 4)
				$(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
		})

		$('#homePage .news-box').each(function (index)
		{
			if (!newsBoxIsShown[index] && $(this).offset().top < $(window).height() * 3 / 4)
				newsBox(index, $(this))
		});
	});


	// setup timer

	//var date = new Date().getTime;
	var date = Math.trunc((((new Date(2018, 7, 18, 18, 0)).getTime() - new Date().getTime())) / 1000);
	var nbDays = Math.trunc(date / (24 * 60 * 60));
	var nbHours = Math.trunc((date - nbDays * 24 * 60 * 60) / (60 * 60));
	var nbMins = Math.trunc((date - nbDays * 24 * 60 * 60 - nbHours * 60 * 60) / 60);
	var nbSecs = Math.trunc(date - nbDays * 24 * 60 * 60 - nbHours * 60 * 60 - nbMins * 60);

	$('.rotate.days b').each(function ()
	{
		if ($(this).text() == nbDays)
		{
			$(this).removeClass('is-hidden');
			$(this).addClass('is-visible');
		}
	});

	$('.rotate.hours b').each(function ()
	{
		if ($(this).text() == nbHours)
		{
			$(this).removeClass('is-hidden');
			$(this).addClass('is-visible');
		}
	});

	$('.rotate.minutes b').each(function ()
	{
		if ($(this).text() == nbMins)
		{
			$(this).removeClass('is-hidden');
			$(this).addClass('is-visible');
		}
	});

	$('.rotate.seconds b').each(function ()
	{
		if ($(this).text() == nbSecs)
		{
			$(this).removeClass('is-hidden');
			$(this).addClass('is-visible');
		}
	});

	var animationDelay = 1000;

	animateHeadline($('.rotate.seconds'));


	function hideWord($word)
	{
		var nextWord = takeNext($word, $('.rotate.minutes .is-visible'));
		switchWord($word, nextWord);
		setTimeout(function () { hideWord(nextWord) }, animationDelay);
	}

	function hideWordNoRepeat($word, $nextUnit)
	{
		var nextWord = takeNext($word, $nextUnit);
		switchWord($word, nextWord);
	}

	function takeNext($word, $nextUnit)
	{
		if (!$word.is(':last-child'))
			return $word.next();
		else
		{
			if ($word.text() != "23")
				hideWordNoRepeat($nextUnit, $('.rotate.hours .is-visible'));
			else
				hideWordNoRepeat($nextUnit, $('.rotate.days .is-visible'));

			return $word.parent().children().eq(0);
		}
	}

	function switchWord($oldWord, $newWord)
	{
		$oldWord.removeClass('is-visible').addClass('is-hidden');
		$newWord.removeClass('is-hidden').addClass('is-visible');
	}

	function animateHeadline($headlines)
	{
		$headlines.each(function ()
		{
			var headline = $(this);
			//trigger animation
			setTimeout(function () { hideWord(headline.find('.is-visible')); }, animationDelay);
			//other checks here ...
		});
	}



	function newsBox(index, $newsBox)
	{
		newsBoxIsShown[index] = true;
		$newsBox.find($('.boxOutline')).addClass('shown');
		$newsBox.find($('.postDrawingAnimation')).addClass('disapear');
		$newsBox.find($('.postDrawingAnimation2')).addClass('disapear');
		setTimeout(showNewsPicture.bind(null, $newsBox), 2000);
		setTimeout(showNewsText.bind(null, $newsBox), 3200);

	}

	function showNewsPicture($newsBox)
	{
		$newsBox.find($('.news-picture')).fadeIn();
	}

	function showNewsText($newsBox)
	{
		$newsBox.find($('.news-post')).fadeIn();
		$newsBox.find($('.postDrawingAnimation2')).hide();
		$newsBox.find($('.postDrawingAnimation')).hide();
	}
//});

