/* resizeImage function */
(function(a){a.fn.resizeImage=function(b){var d=350;var c=350;return this.each(function(){var g=0;var f=a(this).width();var e=a(this).height();if(f>d){g=d/f;a(this).css("width",d);a(this).css("height",e*g);e=e*g;f=f*g}if(e>c){g=c/e;a(this).css("height",c);a(this).css("width",f*g);f=f*g}})}})(jQuery);


var paperPanel = (function(){
    	
    function getPooContainer(id, title, author, src){
    	return $('<li />', {'poostId': id }).append(
					$('<div />', {'class':'paper-piece'}).html(
						'<h1>' + title + '</h1><h2>' + author + '</h2><div class="photo loading"><img src="' + src + '" /><div class="photo-buttons"><a class="not-poo">Não é cocô!</a></div></div>'));
    }
    
    masterPiece = {
    	val:function(){
    		var valInputMasterPiece = $('input[name="masterpiece"]').val();
    		
    		if(valInputMasterPiece=='Titulo da obra'){
    			return "";
    		}
    		return trim(valInputMasterPiece);
    	}
    }
    
    artist = {
    	val:function(){
    		var valInputArist = $('input[name="artist"]').val();
    		
    		if(valInputArist=='Nome do artista'){
    			return "";
    		}
    		return trim(valInputArist);
    	}
    }
    
	return{
		validateForm: function(){
			var masterpiece = $('input[name="masterpiece"]');
			var artist = $('input[name="artist"]');
			var poo = $('input[name="poo"]');
			var valid = true;
			
			if ($.trim(poo.val()) == '')
			{
				alert('Escolha uma obra de arte para enviar!');
				poo.focus();
				valid = false;
			}
			else if (masterPiece.val()== ''){
				alert('Uma grande obra deve ter um grande nome!');
				masterpiece.focus();
				valid = false;
			}
			else if (artist.val() == ''){
				alert('Deixe a timidez de lado! Todos querem saber o nome do artista!');
				artist.focus();
				valid = false;
			}
			return valid;
		},
		hidePoo: function(poo){
			poo.slideUp(500);
		},
		loadOldPoos: function(){
			var footer = $('#paper-footer');
			
			if (!footer.hasClass('loading')){
				var lastPooId = 1;
				var toAppend = [];
				var i = 0;
				footer.addClass('loading');
				poostagram.getMorePoos(lastPooId, function(poos){
				
					for (var item in poos) {
						var paperPiece = getPooContainer(poos[item].id, poos[item].title, poos[item].author, poos[item].src);
						$('#load-more').before(paperPiece);
						paperPiece.find('img').load(function(){
							$(this).closest('.photo').removeClass('loading');
							$(this).resizeImage();
						});
						paperPiece.find('.not-poo').click(function(){
							paperPanel.hidePoo($(this).closest('li'));
						});
					}
					footer.removeClass('loading');
				});
			}
		},
		loadNewPoos: function(){
			var footer = $('#paper-footer');
			
			if (!footer.hasClass('loading')){
				var lastPooId = 1;
				var toAppend = [];
				var i = 0;
				footer.addClass('loading');
				poostagram.getMorePoos(lastPooId, function(poos){
				
					for (var item in poos) {
						var paperPiece = getPooContainer(poos[item].id, poos[item].title, poos[item].author, poos[item].src);
						$('#refresh').after(paperPiece);
						paperPiece.find('img').load(function(){
							$(this).closest('.photo').removeClass('loading');
							$(this).resizeImage();
						});
						paperPiece.find('.not-poo').click(function(){
							paperPanel.hidePoo($(this).closest('li'));
						});
					}
					footer.removeClass('loading');
					
					$("html, body").animate({ scrollTop: 0 }, "slow");
					
				});
			}
		},
	};

})();



$.ajaxSetup({
  error:function(xhr,status,code){
  		alert(xhr.responseText);
  }
});

$(document).ready(function(){	
	
	paperPanel.loadOldPoos();
	
	$('#load-more').click(function(){
		paperPanel.loadOldPoos();
	});
	
	$('#refresh').click(function(){
		paperPanel.loadNewPoos();
	})
	
	$('#upload-form').ajaxForm(function(data){
		 alert(data.message);
	});	
	
	$('#to-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, "slow");
	})

	
//	$(window).scroll(function () { 
//	    
//	    $('#output').text("You've scrolled " + $(window).scrollTop() + " pixels");
//	    
//	    $('#paper').css('background-position-y', $(window).scrollTop());
//	    
//	});
//	




});