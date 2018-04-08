jQuery(document).ready(function ($)
{
	var container = document.getElementById("mainSection");

	var contentSections = $('#homePage section');
	var verticalNavigation = $('.vertical-nav');
	var navigationItems = verticalNavigation.find('a');
	var scrollArrow = $('.scroll-down');

	//smooth scroll to the selected section

	var canScroll = true;
	var portfolioIsShown = false;


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
		$('#homePageVerticalNav').offset({ top: 0, left: $('#homePageVerticalNav').offset.left });
		updateSections();

		if (!portfolioIsShown && $('#portfolio').offset().top < $(window).height() * 3 / 4)
		{
			showPortfolio();
			portfolioIsShown = true;
		}
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


	//animateHeadline($('.rotate.minutes'));
	//animateHeadline($('.rotate.hours'));
	//animateHeadline($('.rotate.days'));


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
});