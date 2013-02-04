/* resizeImage function */
(function(a){a.fn.resizeImage=function(b){var d=350;var c=350;return this.each(function(){var g=0;var f=a(this).width();var e=a(this).height();if(f>d){g=d/f;a(this).css("width",d);a(this).css("height",e*g);e=e*g;f=f*g}if(e>c){g=c/e;a(this).css("height",c);a(this).css("width",f*g);f=f*g}})}})(jQuery);



/* override alert */
window.alert = function(msg){
	$('#upload-form .message-receiver').append(msg);
}

function throwError(msg) {
	var alertBootstrap = $('<div class="alert alert-error"><button type="button" class="close" data-dismiss="alert">&times;</button>' + msg + '</div>');
	$('#upload-form').next(alertBootstrap);
}
  
var paperPanel = (function(){
    	
    function getPooContainer(id,sequence, title, author, src){
    	
    	var _id = new String(id);

    	var d = _id.substring(0,2);
		var m = _id.substring(2,3);
		var y = _id.substring(3,7);
    	
    	return $('<div />', {'data-poost-id': id,'data-sequence':sequence, 'class':'paper'}).html(
						'<div class="photo"><h1>' + title + '</h1><h2>' + author + '</h2><img src="' + src + '" /><h6><i>Day ' + d + ' Month ' + m + ' year ' + y +'</i></h6></div>');
    }
	
	
	
	var inputMasterPiece = $('input[name="masterpiece"]');
	var inputArtist = $('input[name="artist"]');	
    var inputTypeSubmit = $('#upload-form :button');
    var pooFile = $('input[name="poo"]');

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

    fileSubmit = {
    	clean:function(){
    		pooFile.val(null);
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
			$('#roll').find('.paper-roll').after(paperPiece);
			paperPiece.find('img').load(function(){
				$(this).closest('.photo').removeClass('loading');
				$(this).resizeImage();
			});
		},
		readyToNewPost:function(){
			fileSubmit.clean();
			inputMasterPiece.val(null);
			inputArtist.val(null);
			inputSubmit.enabled();
		},
		lockedToNewPost:function(){
			inputSubmit.disabled();
		},
		validateForm: function(){
			
			var valid = true;
			
			if ($.trim(pooFile.val()) == '')
			{
				alert('Choose your masterpiece to send!');
				throwError('Choose your masterpiece to send!');
				pooFile.focus();
				valid = false;
			}
			else if (inputMasterPiece.val()== '' || inputMasterPiece.val()=='Give it a great name'){
				throwError('A masterpiece should have a great name!');
				inputMasterPiece.focus();
				valid = false;
			}
			else if (inputArtist.val() == '' || inputArtist.val()=='Don/\'t be shy'){
				throwError('Don\'t be shy! Everybody wants to know the artist\'s name!');
				inputArtist.focus();
				valid = false;
			}
			return valid;
		},
		hidePoo: function(poo){
			poo.slideUp(500);
			
			var pooDay = poo.attr('data-poost-id');
			var pooSequence = poo.attr('data-sequence');
			
			
			poostagram.denouncesPoo(pooDay, pooSequence, function (callback) {
				alert(notifier.notice(0,callback.message));
			});
			
		},
		loadOldPoos: function(){
			var footer = $('#roll').find('.load-more, .paper-new');
			var lastPoo = $('div.paper:not(.load-more, .paper-new)').last();
			
			if (!footer.hasClass('loading')){
				var lastPooDay = lastPoo.attr('data-poost-id');
				var lastPooSequence = lastPoo.attr('data-sequence');
				var toAppend = [];
				var i = 0;
				footer.addClass('loading');
				poostagram.getOldPoos(lastPooDay, lastPooSequence, function(poos){
				
					for (var item in poos) {
						var paperPiece = getPooContainer(
							poos[item].poostDay,
							poos[item].poostSequence,
							poos[item].masterPiece, 
							poos[item].artist, 
							poos[item].url);
						$('#roll').find('.load-more').before(paperPiece);
						paperPiece.find('img').load(function(){
							$(this).closest('.photo').removeClass('loading');
							$(this).resizeImage();
						});
						paperPiece.find('.not-poo').click(function(){
							paperPanel.hidePoo($(this).closest('div.paper'));
						});
					}
					footer.removeClass('loading');
				});
			}
		},
		loadNewPoos: function(){
			var footer = $('#roll').find('.load-more, .paper-new');
			
			if (!footer.hasClass('loading')){
				var toAppend = [];
				var i = 0;
				footer.addClass('loading');
				poostagram.getNewPoos( function(poos){
				
					for (var item in poos) {
						var paperPiece = getPooContainer(
							poos[item].poostDay,
							poos[item].poostSequence,
							poos[item].masterPiece, 
							poos[item].artist, 
							poos[item].url);
						$('#roll').find('.paper-roll').after(paperPiece);
						paperPiece.find('img').load(function(){
							$(this).closest('.photo').removeClass('loading');
							$(this).resizeImage();
						});
						paperPiece.find('.not-poo').click(function(){
							paperPanel.hidePoo($(this).closest('div.paper'));
						});
					}
					footer.removeClass('loading');
					
					$("html, body").animate({ scrollTop: 0 }, "slow");
					
				});
			}
		},
		failSubmit: function(message){
			alert(message);
			$('#upload-form .alert-error').bind('closed',function(){
				fileSubmit.clean();
				inputSubmit.enabled();
			});
		}
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

var notifier = (function(){

	function decisor(code){
		var custom;
	    switch(code){
		    case 200:	
		        custom = "alert-success";
		        break;
		    case 400:
		        custom = "alert-error";
		        break;
		    case 500:
		        custom = "alert-error";
		        break;
		    default: 
		    	custom = "alert-info";
			break;
		}
		return custom;
	}

	return {
			notice: function(code,message){
				var element = '<div class="alert ' + decisor(code) + ' fade in">';
				element += message + '<button type="button" class="close" data-dismiss="alert">x</button></div>';
				return element.toString();
			}
	};
})();

$(document).ready(function(){	
	
	
	paperPanel.loadNewPoos();
	
	$('#old-poos').click(function(){
		paperPanel.loadOldPoos();
	});
	
	$('#new-poos, #new-poos-phone').click(function(){
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
		 	alert(notifier.notice(200,data.message));
		 	paperPanel.readyToNewPost();
		},
		error: function(xhr,status,code){
			paperPanel.failSubmit(notifier.notice(xhr.status,xhr.responseText));
		}
	};
	$('#upload-form').ajaxForm(ajaxFormOptions);
	
	$('#to-top').click(function(){
		$("html, body").animate({ scrollTop: 0 }, "slow");
	});
});
