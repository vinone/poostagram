
(function( $ ){

  $.fn.resizeImage = function( options ) {  
  
    return this.each(function() {
        var maxWidth = 350; // Max width for the image
        var maxHeight = 350;    // Max height for the image
        var ratio = 0;  // Used for aspect ratio
        var width = $(this).width();    // Current image width
        var height = $(this).height();  // Current image height

        // Check if the current width is larger than the max
        if(width > maxWidth){
            ratio = maxWidth / width;   // get ratio for scaling image
            $(this).css("width", maxWidth); // Set new width
            $(this).css("height", height * ratio);  // Scale height based on ratio
            height = height * ratio;    // Reset height to match scaled image
            width = width * ratio;    // Reset width to match scaled image
        }

        // Check if current height is larger than max
        if(height > maxHeight){
            ratio = maxHeight / height; // get ratio for scaling image
            $(this).css("height", maxHeight);   // Set new height
            $(this).css("width", width * ratio);    // Scale width based on ratio
            width = width * ratio;    // Reset width to match scaled image
        }
        
        $(this).addClass('resized');
        
    });

  };
})( jQuery );





function loadMorePoos(){

	var lastPooId = 1;
	var toAppend = [];
	var i = 0;
	
	poostagram.getMorePoos(lastPooId, function(poos){
	
			for (var item in poos) {

				toAppend[i++] = '<li poostId="';
				toAppend[i++] = poos[item].id;
				toAppend[i++] = '"><div class="paper-piece"><h1>';
				toAppend[i++] = poos[item].title;
				toAppend[i++] = '</h1><h2>';
				toAppend[i++] = poos[item].author;
				toAppend[i++] = '</h2><div class="photo"><img src="';
				toAppend[i++] = poos[item].src;
				toAppend[i++] = '" /><div class="photo-buttons"><a href="#">Não é cocô!</a></div></div></div></li>';

			}
	
			$('#toilet-paper').append(toAppend.join(''));
			
			$('.photo img:not(resized)').each(function() {
			    $(this).resizeImage();
			});
			
			$('#toilet-paper').append($('#paper-footer'));
			
			//window.scrollTo(0, document.body.scrollHeight);
			
	
	});

}




$(document).ready(function(){	
	
	$('#load-more').click(function(){
		loadMorePoos();
	});
	
	$('.photo img:not(resized)').each(function() {
	    $(this).resizeImage();
	});
	
	
	$('#input-right').click(function(){
	
		$.post('upload', { 
					artist: $('input[name="artist"]').val(), 
					masterpiece: $('input[name="masterpiece"]').val(),
					poo: $('input[name="poo"]').val()
					}, function(data) {
		  alert('Sua obra foi poostada!');
		});
	
	});



//	$(window).scroll(function () { 
//	    
//	    $('#output').text("You've scrolled " + $(window).scrollTop() + " pixels");
//	    
//	    $('#paper').css('background-position-y', $(window).scrollTop());
//	    
//	});
//	


});