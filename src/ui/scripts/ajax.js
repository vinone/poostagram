

var poostagram = (function(){
    	
	return{
		getNewPoos: function(callback){
			$.getJSON('list',function(data){
				return callback(data);
			});
		},
		getOldPoos: function(lastPooDay, lastPooSequence, callback){
			$.getJSON('list/' + lastPooDay + '/' + lastPooSequence,function(data){
				return callback(data);
			});
		},
		denouncesPoo: function (pooDay, pooSequence, callback) {
			$.post('noPoo', { 'poostDay': pooDay, 'poostSequence' : pooSequence }, function(data){
				return callback(data);
			});
		},
		getMessage:function(callback){
			var x = setTimeout(function () {
				alert('123');
				callback();
			},500);
		}
	};

})();

  