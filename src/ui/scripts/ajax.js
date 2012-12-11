

var poostagram = (function(){
    	
	return{
		getMorePoos: function(lastPooId, callback){
			$.getJSON('list',function(data){
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

  