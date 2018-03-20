jQuery(document).ready(function($)
{

	isAnimated = false;


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

			$("body").css("overflow", "visible");

			isAnimated = false;
		}, 2000);
	}

	function closeSectionBlock(sectionBlockClosed, sectionBlockHidden)
	{
		isAnimated = true;

		$("body").css("overflow", "hidden");

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
});
