
//console.log('lol');


//var timelineBlocks = $('.timeline-block');
//var offset = 0.8;

//hide timeline blocks which are outside the viewport
//hideBlocks(timelineBlocks, offset);
	//on scolling, show/animate timeline blocks when enter the viewport
//$(window).on('scroll', function(){
//	(!window.requestAnimationFrame) 
//		? setTimeout(function(){ showBlocks(timelineBlocks, offset); }, 100)
//		: window.requestAnimationFrame(function(){ showBlocks(timelineBlocks, offset); });
//});

//function hideBlocks(blocks, offset)
//{
//	blocks.each(function(){
//		( $(this).offset().top > $(window).scrollTop()+$(window).height()*offset ) && $(this).find('.timeline-img, .timeline-content').addClass('is-hidden');
//	});
//}

//function showBlocks(blocks, offset)
//{
//	blocks.each(function ()
//	{
//		( $(this).offset().top <= $(window).scrollTop()+$(window).height()*offset && $(this).find('.timeline-img').hasClass('is-hidden') ) && $(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
//	});
//}

container.addEventListener('ps-scroll-y', function () 
{

	$('.timeline-block').each(function ()
	{
		if ($(this).find('.timeline-img').hasClass('is-hidden') && $(this).offset().top < $(window).height() * 3 / 4)
			$(this).find('.timeline-img, .timeline-content').removeClass('is-hidden').addClass('bounce-in');
	})
});

// set locale time in timeline date
$('#timelinePage .timeline .timeline-content .date').each(function ()
{
	$(this).html((new Date($(this).html())).toLocaleString('fr-FR', { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
});
