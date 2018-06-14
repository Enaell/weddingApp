//var ps = new PerfectScrollbar('#mainSection');
var ps = new PerfectScrollbar('#mainSection', { suppressScrollX: true });


jQuery(document).ready(function ($)
{
	var MQ = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	$(window).on('resize', function ()
	{
		MQ = window.getComputedStyle(document.querySelector('body'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
	});

	if (MQ == 'desktop')
	{
		$('html').addClass('no-touch');
		$('html').removeClass('touch');
	}

	if ($('html').width() > 800)
		$('html').addClass('no-touch');

	isAnimated = false;

	// Perfect Scrollbar
	container = document.getElementById("mainSection");

	// ps.update(); when size of mainSection change, like when page is changeds

	$(document).keydown(function(event)
	{
		if( event.which=='38' && !isAnimated) 
			openSectionBlock($("#welcomeSection .half-block"), $('#mainSection'));
		 else if( event.which=='40' && !isAnimated) 
			closeSectionBlock($("#welcomeSection .half-block"), $('#mainSection'))
	});

	function openSectionBlock(sectionBlockOpened, sectionBlockRevealed)
	{
		isAnimated = true;

		$('#mainNav').fadeIn(2000)

		sectionBlockOpened.addClass('duration2s');

		sectionBlockRevealed.addClass('duration2s');

		sectionBlockOpened.addClass('opened');

		sectionBlockRevealed.addClass('shown');

		setTimeout(function()
		{
			sectionBlockOpened.removeClass('duration2s');

			sectionBlockRevealed.removeClass('duration2s');

			isAnimated = false;
		}, 2000);
	}

	function closeSectionBlock(sectionBlockClosed, sectionBlockHidden)
	{
		isAnimated = true;

		$('#mainNav').fadeOut(2000)

		sectionBlockClosed.addClass('duration2s');

		sectionBlockHidden.addClass('duration2s');

		sectionBlockClosed.removeClass('opened');

		sectionBlockHidden.removeClass('shown');;

		setTimeout(function(){
			sectionBlockClosed.removeClass('duration2s');

			sectionBlockHidden.removeClass('duration2s');

			isAnimated = false;
		}, 2000);
	}


	var canScroll = true;

	function mainSectionSmoothScroll(distance, direction)
	{
		var minDistance = 0;

		if (distance > 5)
		{
			minDistance = Math.min(40, distance / 5);

			document.querySelector('#mainSection').scrollTop += (minDistance * direction);
			distance -= minDistance;
			setTimeout(function () { mainSectionSmoothScroll(distance, direction); }, 10);
		}
		else
			canScroll = true;
	}

	// Smooth scrolling using jQuery easing
	$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function ()
	{
		if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname)
		{
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
			if (target.length)
			{
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
				return false;
			}
		}
	});

	// NAVIGATION

	// Closes responsive menu when a scroll trigger link is clicked
	$('.js-scroll-trigger').click(function () {
		$('.navbar-collapse').collapse('hide');
	});

	// Activate scrollspy to add active class to navbar items on scroll
	$('#mainSection').scrollspy({
		target: '#mainNav',
		offset: 56
	});

	// Collapse Navbar
	var navbarCollapse = function () {
		if (document.querySelector('#mainSection').scrollTop > 100) {
			$("#mainNav").addClass("navbar-shrink");
		} else {
			$("#mainNav").removeClass("navbar-shrink");
		}
	};
	// Collapse now if page is not at top
	navbarCollapse();
	// Collapse the navbar when page is scrolled
	container.addEventListener('ps-scroll-y', function () 
	{
		navbarCollapse();
	});





});

function showPage(pageId)
{
	$('.page').each(function ()
	{
		var page = $(this);
		if (this.id !== pageId)
		{
			page.removeClass('shown');
			document.querySelector('#mainSection').scrollTop = 0;
			ps.update();
		} else
		{
			if (page.children().length == 0) // CA MARCHE ! OMG !!
			{
				$.ajax({
					method: "GET",
					url: "http://localhost:1337/timeline",
					success: function (data)
					{
						//data is the resultant html when gets created by res.render()
						// wanna show it, add it to the dom
						page.html(data);
						page.addClass('shown');
						document.querySelector('#mainSection').scrollTop = 0;
						ps.update();
					}
				});
			}
			else
			{
				page.addClass('shown');
				document.querySelector('#mainSection').scrollTop = 0;
				ps.update();
			}
		}
	})
}