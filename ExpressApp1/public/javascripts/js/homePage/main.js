jQuery(document).ready(function ($)
{
	var container = document.getElementById("mainSection");

	var contentSections = $('#homePage section');
	var verticalNavigation = $('.vertical-nav');
	var navigationItems = verticalNavigation.find('a');
	var scrollArrow = $('.scroll-down');

	//$(window).on('scroll', checkScroll);


	//smooth scroll to the selected section

	var canScroll = true;

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

	//function checkScroll() {
	//	if( !scrolling ) {
	//		scrolling = true;
	//		(!window.requestAnimationFrame) ? setTimeout(updateSections, 300) : window.requestAnimationFrame(updateSections);
	//	}
	//}

	function updateSections() {
		var halfWindowHeight = $(window).height() / 2;
		//		var scrollTop = $(window).scrollTop();
		var scrollTop = container.scrollTop;

		var activeSectionFound = false;
		
		$(contentSections.get().reverse()).each(function ()
		{
			var section = $(this),
				sectionId = section.attr('id'),
				navigationItem = navigationItems.filter('[href^="#'+ sectionId +'"]');
			//( (section.offset().top - halfWindowHeight < scrollTop ) && ( section.offset().top + section.height() - halfWindowHeight > scrollTop) )
				//? navigationItem.addClass('active')
				//: navigationItem.removeClass('active');


			// section.offset().top > scrollTop + halfWindowHeight ==> remove active.

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
		//$('#homePageVerticalNav').offset().left = 0;
		$('#homePageVerticalNav').offset({ top: 0, left: $('#homePageVerticalNav').offset.left });
		updateSections();
	});


	    ////smooth scroll to the second section
    //scrollArrow.on('click', function(event){
    //	event.preventDefault();
    //    smoothScroll($(this.hash));
    //});

		//function smoothScroll(target) {
 //       $('body,html').animate(
 //       	{'scrollTop':target.offset().top},
 //       	300
 //       );
	//}


});