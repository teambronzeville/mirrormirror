jQuery(document).ready(function($){

	// hiding all of this unless we actually need it - pk2
	// // browser window scroll (in pixels) after which the "back to top" link is shown
	// var offset = 300,
	// 	//browser window scroll (in pixels) after which the "back to top" link opacity is reduced
	// 	offset_opacity = 1200,
	// 	//duration of the top scrolling animation (in ms)
	// 	scroll_top_duration = 700,
	// 	//grab the "back to top" link
	// 	$back_to_top = $('.cd-top');
	//
	// //hide or show the "back to top" link
	// $(window).scroll(function(){
	// 	( $(this).scrollTop() > offset ) ? $back_to_top.addClass('cd-is-visible') : $back_to_top.removeClass('cd-is-visible cd-fade-out');
	// 	if( $(this).scrollTop() > offset_opacity ) {
	// 		$back_to_top.addClass('cd-fade-out');
	// 	}
	// });
	//
	// //smooth scroll to top
	// $back_to_top.on('click', function(event){
	// 	event.preventDefault();
	// 	$('body,html').animate({
	// 		scrollTop: 0 ,
	// 	 	}, scroll_top_duration
	// 	);
	// });

	var $contentTarget = $('#contentTarget');

	function loadContentForId(id) {
			var contentNode = document.getElementById(id);
			if(!contentNode) { return; } // Je m'en fiche.
			var content = document.importNode(contentNode.content, true);
			$contentTarget.html(content);
	}

	$(window).on("hashchange", function(evt) {
		console.log(evt);
		var url = evt.originalEvent.newURL;
		var contentId = url.slice(url.indexOf('#') + 1);
		loadContentForId(contentId); // assumes all hashes have content
	});

	// init
	if(window.location.hash === '') {
			window.location.hash = 'welcome';
	} else {
		// this is gross. find a better way.
		var tmp = window.location.hash;
		window.location.hash = '';
		window.location.hash = tmp;
	}

});
