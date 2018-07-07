jQuery(document).ready(function ($)
{
	//final width --> this is the quick view image slider width
	//maxQuickWidth --> this is the max-width of the quick-view panel
	var sliderFinalWidth = 400,
		maxQuickWidth = 900;

	container.addEventListener('ps-scroll-y', function () 
	{

		//	$('#timelinePage .fillTimeLine').offset({ top: 0, left: $('#timelinePage .fillTimeLine').offset.left });
		//$('#timelinePage .fillTimeLine').height($(window).height() * 2 / 3 - $('#timelinePage .fillTimeLine').offset().top)

		$('#projectPage .overlay-layer').offset({ top: 0 });
		resizeQuickView();
		//$('#timelinePage .modal-is-open .event-modal').offset({ top: ($(window).height() - $('#timelinePage .modal-is-open .event-modal').height()) / 2, left: $('#timelinePage .modal-is-open .event-modal').offset.left });
	});


	//open the quick view panel
	$('#projectPage .trigger').on('click', function (event)
	{
		var selectedImage = $(this).parent('.item').children('img'),
			slectedImageUrl = selectedImage.attr('src');


		$('.overlay-layer').fadeIn();
		$('#projectPage .overlay-layer').offset({ top: 0 });

		animateQuickView(selectedImage, sliderFinalWidth, maxQuickWidth, 'open');

		//update the visible slider image in the quick view panel
		//you don't need to implement/use the updateQuickView if retrieving the quick view data with ajax
		updateQuickView(slectedImageUrl);
	});

	//close the quick view panel
	$('.overlay-layer').on('click', function ()
	{
		closeQuickView(sliderFinalWidth, maxQuickWidth);

		//if ($(event.target).is('.close') || $(event.target).is('#projectPage.overlay-layer'))
		//{
		//	closeQuickView(sliderFinalWidth, maxQuickWidth);
		//}
	});


	$(document).keyup(function (event)
	{
		//check if user has pressed 'Esc'
		if (event.which == '27')
		{
			closeQuickView(sliderFinalWidth, maxQuickWidth);
		}
	});

	//quick view slider implementation
	$('#projectPage .quick-view').on('click', '.slider-navigation a', function ()
	{
		updateSlider($(this));
	});

	//center quick-view on window resize
	$(window).on('resize', function ()
	{
		if ($('#projectPage .quick-view').hasClass('is-visible'))
		{
			window.requestAnimationFrame(resizeQuickView);
		}
	});

	function updateSlider(navigation)
	{
		var sliderConatiner = navigation.parents('.slider-wrapper').find('.slider'),
			activeSlider = sliderConatiner.children('.selected').removeClass('selected');
		if (navigation.hasClass('next'))
		{
			(!activeSlider.is(':last-child')) ? activeSlider.next().addClass('selected') : sliderConatiner.children('li').eq(0).addClass('selected');
		} else
		{
			(!activeSlider.is(':first-child')) ? activeSlider.prev().addClass('selected') : sliderConatiner.children('li').last().addClass('selected');
		}
	}

	function updateQuickView(url)
	{
		$('#projectPage .quick-view .slider li').removeClass('selected').find('img[src="' + url + '"]').parent('li').addClass('selected');
	}

	function resizeQuickView()
	{
		var quickViewLeft = ($(window).width() - $('#projectPage .quick-view').width()) / 2,
			quickViewTop = ($(window).height() - $('#projectPage .quick-view').height()) / 2;

		//$('#projectPage .quick-view').offset({ top: quickViewTop, left: quickViewLeft });

		$('#projectPage .quick-view').css({
			"top": -$('#projectPage').offset().top + quickViewTop,
			"left": quickViewLeft,
		});
	}

	function closeQuickView(finalWidth, maxQuickWidth)
	{
		var close = $('#projectPage .close'),
			activeSliderUrl = close.siblings('.slider-wrapper').find('.selected img').attr('src'),
			selectedImage = $('.empty-box').find('img');
		//update the image in the gallery
		if (!$('#projectPage .quick-view').hasClass('velocity-animating') && $('#projectPage .quick-view').hasClass('add-content'))
		{
			selectedImage.attr('src', activeSliderUrl);
			animateQuickView(selectedImage, finalWidth, maxQuickWidth, 'close');
		} else
		{
			closeNoAnimation(selectedImage, finalWidth, maxQuickWidth);
		}
		$('.overlay-layer').fadeOut();
	}

	function animateQuickView(image, finalWidth, maxQuickWidth, animationType)
	{
		//store some image data (width, top position, ...)
		//store window data to calculate quick view panel position
		var parentListItem = image.parent('.item'),
			topSelected = image.offset().top - $(window).scrollTop(),
			leftSelected = image.offset().left,
			widthSelected = image.width(),
			heightSelected = image.height(),
			windowWidth = $(window).width(),
			windowHeight = $(window).height(),
			finalLeft = (windowWidth - finalWidth) / 2,
			finalHeight = finalWidth * heightSelected / widthSelected,
			finalTop = (windowHeight - finalHeight) / 2,
			quickViewWidth = (windowWidth * .8 < maxQuickWidth) ? windowWidth * .8 : maxQuickWidth,
			quickViewLeft = (windowWidth - quickViewWidth) / 2;

		//var quickViewLeft = ($(window).width() - $('#projectPage .quick-view').width()) / 2,
		var	quickViewTop = ($(window).height() - $('#projectPage .quick-view').height()) / 2;

		if (animationType == 'open')
		{

			//hide the image in the gallery
			parentListItem.addClass('empty-box');
			//place the quick view over the image gallery and give it the dimension of the gallery image
			$('#projectPage .quick-view').css(
			{
				"top": -$('#projectPage').offset().top + topSelected,
				"left": leftSelected,
				"width": widthSelected,
			}).velocity({
				//animate the quick view: animate its width and center it in the viewport
				//during this animation, only the slider image is visible
				'top': -$('#projectPage').offset().top + finalTop + 'px',
				'left': finalLeft + 'px',
				'width': finalWidth + 'px',
			}, 1000, [400, 20], function ()
			{
				//animate the quick view: animate its width to the final value
				$('#projectPage .quick-view').addClass('animate-width').velocity({
					'left': quickViewLeft + 'px',
					'width': quickViewWidth + 'px',
				}, 300, 'ease', function ()
				{
					//show quick view content
					$('#projectPage .quick-view').addClass('add-content');
				});
			}).addClass('is-visible');
		} else
		{
			//close the quick view reverting the animation
			$('#projectPage .quick-view').removeClass('add-content').velocity({
				'top': -$('#projectPage').offset().top + finalTop + 'px',
				'left': finalLeft + 'px',
				'width': finalWidth + 'px',
			}, 300, 'ease', function ()
			{
				$('#projectPage').removeClass('overlay-layer');
				$('#projectPage .quick-view').removeClass('animate-width').velocity({
					"top": -$('#projectPage').offset().top + topSelected,
					"left": leftSelected,
					"width": widthSelected,
				}, 500, 'ease', function ()
				{
					$('#projectPage .quick-view').removeClass('is-visible');
					parentListItem.removeClass('empty-box');
				});
			});
		}
	}
	function closeNoAnimation(image, finalWidth, maxQuickWidth)
	{
		var parentListItem = image.parent('#projectPage .item'),
			topSelected = image.offset().top - $(window).scrollTop(),
			leftSelected = image.offset().left,
			widthSelected = image.width();

		$('#projectPage').removeClass('overlay-layer');
		parentListItem.removeClass('empty-box');
		$('#projectPage .quick-view').velocity("stop").removeClass('add-content animate-width is-visible').css({
			"top": -$('#projectPage').offset().top + topSelected,
			"left": leftSelected,
			"width": widthSelected,
		});
	}
});