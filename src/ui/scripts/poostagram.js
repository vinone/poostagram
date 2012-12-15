/* resizeImage function */
(function(a){a.fn.resizeImage=function(b){var d=350;var c=350;return this.each(function(){var g=0;var f=a(this).width();var e=a(this).height();if(f>d){g=d/f;a(this).css("width",d);a(this).css("height",e*g);e=e*g;f=f*g}if(e>c){g=c/e;a(this).css("height",c);a(this).css("width",f*g);f=f*g}})}})(jQuery);


  
var paperPanel = (function(){
    	
    function getPooContainer(id,sequence, title, author, src){
    	return $('<li />', {'poostId': id,'sequence':sequence }).append(
					$('<div />', {'class':'paper-piece'}).html(
						'<h1>' + title + '</h1><h2>' + author + '</h2><div class="photo loading"><img src="' + src + '" /><div class="photo-buttons"><a class="not-poo">Não é cocô!</a></div></div>'));
    }
	
	var inputTextMasterPiece = $('input[name="masterpiece"]');
	var inputTextMasterPieceDefaultText = "Titulo da obra";
	
	var inputTextArtist = $('input[name="artist"]');
	var inputTextArtistDefaultText = "Nome do artista";
	
    var inputTypeSubmit = $('input[type="submit"]');
    var pooFile = $('input[name="poo"]');
    
    
    inputMasterPiece = {
    
    	val:function(value){
    		
    		if(value){
    			inputTextMasterPiece.val(value);
    			return;
    		}
    			
    		if(inputTextMasterPiece.val()==inputTextMasterPieceDefaultText){
    			return "";
    		}
    		return $.trim(inputTextMasterPiece.val());
    	},
    	focus:function(){
    		inputTextMasterPiece.focus();
    	}
    };
    
    inputArtist = {

    	val:function(value){
			
			if(value){
				inputTextArtist.val(value);
				return;
			}
			
    		if(inputTextArtist.val()==inputTextArtistDefaultText){
    			return "";
    		}
    		return $.trim(inputTextArtist.val());
    	},
    	focus:function(){
    		inputTextArtist.focus();
    	}
    };
    
    inputSubmit = {
    	enabled:function(){
    		inputTypeSubmit.attr('disabled',null);
    	},
    	disabled:function(){
    		inputTypeSubmit.attr('disabled','true');
    	},
    	visible:function(){
    		inputTypeSubmit.show();
    	},
    	hide:function(){
    		inputTypeSubmit.hide();
    	}
    	
    }
    
	return{
		insertNewPoo:function(id,sequence, title, author, src){
			var paperPiece = getPooContainer(
				id,
				sequence,
				title, 
				author, 
				src);
			$('#refresh').after(paperPiece);
			paperPiece.find('img').load(function(){
				$(this).closest('.photo').removeClass('loading');
				$(this).resizeImage();
			});
			paperPiece.find('.not-poo').click(function(){
				paperPanel.hidePoo($(this).closest('li'));
			});
		},
		readyToNewPost:function(){
			inputSubmit.visible();
			pooFile.val(null);
			inputMasterPiece.val(inputTextMasterPieceDefaultText);
			inputArtist.val(inputTextArtistDefaultText);
			
		},
		lockedToNewPost:function(){
			inputSubmit.hide();	
		},
		validateForm: function(){
			
			var valid = true;
			
			if ($.trim(pooFile.val()) == '')
			{
				alert('Escolha uma obra de arte para enviar!');
				pooFile.focus();
				valid = false;
			}
			else if (inputMasterPiece.val()== ''){
				alert('Uma grande obra deve ter um grande nome!');
				inputMasterPiece.focus();
				valid = false;
			}
			else if (inputArtist.val() == ''){
				alert('Deixe a timidez de lado! Todos querem saber o nome do artista!');
				inputArtist.focus();
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
						var paperPiece = getPooContainer(
							poos[item].poostDay,
							poos[item].poostSequence,
							poos[item].masterPiece, 
							poos[item].artist, 
							poos[item].url);
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
						var paperPiece = getPooContainer(
							poos[item].poostDay,
							poos[item].poostSequence,
							poos[item].masterPiece, 
							poos[item].artist, 
							poos[item].url);
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

var socket = io.connect('/');
	socket.on('newPoo', function (data) {
	
		paperPanel.insertNewPoo(
			data.poostDay,
			data.poostSequence,
			data.masterPiece, 
			data.artist, 
			data.url);
	});

$(document).ready(function(){	
	
	
	
	paperPanel.loadOldPoos();
	
	$('#load-more').click(function(){
		paperPanel.loadOldPoos();
	});
	
	$('#refresh').click(function(){
		paperPanel.loadNewPoos();
	})
	
	var ajaxFormOptions = {
		beforeSubmit:function(){
			var validated = paperPanel.validateForm();
			if(validated){
				paperPanel.lockedToNewPost();
			}
			return validated;
		},
		success:function(data){
		 	alert(data.message);
		 	paperPanel.readyToNewPost();
		}
	};
	
	$('#upload-form').ajaxForm(ajaxFormOptions);
	
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