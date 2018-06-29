
var imgValue = "";

//set height of fillTimeLine item
function setFisrtFillTimeLineSize()
{
	setTimeout(function ()
	{
		if ($('#timelinePage .fillTimeLine').offset().top !== 0)
			$('#timelinePage .fillTimeLine').height($(window).height() * 2 / 3 - $('#timelinePage .fillTimeLine').offset().top)
		else
			setFisrtFillTimeLineSize();
	}, 10)
}
setFisrtFillTimeLineSize();


container.addEventListener('ps-scroll-y', function () 
{

	showTimelineBlocks();
	updateTimeLineBg();

	$('#timelinePage .background').offset({ top: 0 });


//	$('#timelinePage .fillTimeLine').offset({ top: 0, left: $('#timelinePage .fillTimeLine').offset.left });
	$('#timelinePage .fillTimeLine').height($(window).height() * 2 / 3 - $('#timelinePage .fillTimeLine').offset().top)

	$('#timelinePage .cover-layer').offset({ top: 0 });
	$('#timelinePage .modal-is-open .event-modal').offset({ top: ($(window).height() - $('#timelinePage .modal-is-open .event-modal').height()) / 2, left: $('#timelinePage .modal-is-open .event-modal').offset.left });
});


function showTimelineBlocks()
{
	$('#timelinePage .timeline-block').each(function ()
	{
		if ($(this).find('.timeline-img').hasClass('is-hidden') && $(this).offset().top < $(window).height() * 2 / 3)
			$(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
	});
}

//function updateTimeLineBg()
//{

//	$($('#timelinePage .timeline-block .timeline-img').get().reverse()).each(function ()
//	{
//		if ($(this).offset().top < $(window).height() * 2 / 3)
//		{
//			console.log('imgValue : ' + imgValue);
//			if (imgValue != $(this).attr('value'))
//			{
//				imgValue = $(this).attr('value');
//				console.log('imgValue 2 : ' + imgValue);

//				$('#timelinePage .background').fadeTo('slow', 0.5, function ()
//				{
//					$(this).css('background-image', 'url("http://localhost:1337/timeline/eventpicture/' + imgValue + '")');
//				}).fadeTo('slow', 1);
//			}
//			//$('#timelinePage .background').css('background-image', 'url("http://localhost:1337/timeline/eventpicture/' + $(this).attr('value') + '")')
//			return false;
//		}
//	});
//}

function updateTimeLineBg()
{
	$($('#timelinePage .timeline-block .timeline-img').get().reverse()).each(function ()
	{
		if ($(this).offset().top < $(window).height() * 2 / 3)
		{
			console.log('imgValue : ' + imgValue);
			if (imgValue != $(this).attr('value'))
			{
				imgValue = $(this).attr('value');
				console.log('imgValue 2 : ' + imgValue);

				// catch when image is loaded.
				var img = new Image();
				img.onload = function ()
				{
					$('#timelinePage .background.disappeared').css('background-image', 'url("http://localhost:1337/timeline/eventpicture/' + imgValue + '")');
					swapBackground();
				}
				img.src = 'http://localhost:1337/timeline/eventpicture/' + imgValue;
				if (img.complete)
					img.onload();

				//				$(this).css('background-image', 'url("http://localhost:1337/timeline/eventpicture/' + imgValue + '")');
			}
			//$('#timelinePage .background').css('background-image', 'url("http://localhost:1337/timeline/eventpicture/' + $(this).attr('value') + '")')
			return false;
		}
	});
}

function swapBackground()
{
	var appearedBg = $('.background.appeared');
	var disappearedBg = $('.background.disappeared');

	appearedBg.removeClass('appeared').addClass('disappeared');
	disappearedBg.removeClass('disappeared').addClass('appeared');

	appearedBg.css('z-index', '-1')
	disappearedBg.css('z-index', '-2')

	disappearedBg.stop(true, true).show();
	appearedBg.stop(true, true).fadeOut();
}


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
		checkResize();
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

