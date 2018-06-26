
container.addEventListener('ps-scroll-y', function () 
{

	$('.timeline-block').each(function ()
	{
		if ($(this).find('.timeline-img').hasClass('is-hidden') && $(this).offset().top < $(window).height() * 3 / 4)
			$(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
	})

	$('.fillTimeLine').offset({ top: 0, left: $('#homePageVerticalNav').offset.left });

	
	$('.cover-layer').offset({ top: 0 });
	$('.modal-is-open .event-modal').offset({ top: ($(window).height() - $('.modal-is-open .event-modal').height()) / 2, left: $('.modal-is-open .event-modal').offset.left });


});

// set locale time in timeline date
$('#timelinePage .timeline .timeline-content .date').each(function ()
{
	$(this).html((new Date($(this).html())).toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
});

var modalTrigger = $('.modal-trigger'),
	transitionLayer = $('.transition-layer'),
	transitionBackground = transitionLayer.children(),
	modalWindow = $('.modal');

var frameProportion = 1.78, //png frame aspect ratio
	frames = 25, //number of png frames
	resize = false;

//set transitionBackground dimentions
setLayerDimensions();
$(window).on('resize', function ()
{
	if (!resize)
	{
		resize = true;
		(!window.requestAnimationFrame) ? setTimeout(setLayerDimensions, 300) : window.requestAnimationFrame(setLayerDimensions);
	}
});

//open modal window
modalTrigger.on('click', function (event)
{
	event.preventDefault();
	transitionLayer.addClass('visible opening');
	var delay = ($('.no-cssanimations').length > 0) ? 0 : 600;
	setTimeout(function ()
	{
		$('.timeline.main-content').hide();
		ps.update();
		$('#mainNav').fadeOut();
		modalWindow.addClass('visible');
	}, delay);
});

//close modal window
modalWindow.on('click', '.modal-close', function (event)
{
	event.preventDefault();
	$('.timeline.main-content').show();
	ps.update();
	transitionLayer.addClass('closing');
	modalWindow.removeClass('visible');
	transitionBackground.one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function ()
	{
		transitionLayer.removeClass('closing opening visible');
		transitionBackground.off('webkitAnimationEnd oanimationend msAnimationEnd animationend');
		$('#mainNav').fadeIn();
	});
});

function setLayerDimensions()
{
	var windowWidth = $(window).width(),
		windowHeight = $(window).height(),
		layerHeight, layerWidth;

	if (windowWidth / windowHeight > frameProportion)
	{
		layerWidth = windowWidth;
		layerHeight = layerWidth / frameProportion;
	} else
	{
		layerHeight = windowHeight * 1.2;
		layerWidth = layerHeight * frameProportion;
	}

	transitionBackground.css({
		'width': layerWidth * frames + 'px',
		'height': layerHeight + 'px',
	});

	resize = false;
}