

var poostagram = (function(){
    	
	return{
		getMorePoos: function(lastPooId, callback){
			var x = setTimeout(function(){
				callback([
					{ id: 1, title: 'MA QUE Bosta!', author: 'mario', src: 'images/poos/e.jpg' },
					{ id: 1, title: 'Bosta', author: 'eu', src: 'images/poos/d.jpg' },
					{ id: 2, title: 'BIG', author: 'paulo', src: 'images/poos/c.jpg' },
					{ id: 3, title: 'Robinho', author: 'Victor', src: 'images/poos/b.jpg' }
				]);
			}, 1000)
		},
		getMessage:function(callback){
			var x = setTimeout(function () {
				alert('123');
				callback();
			},500);
		}
	};

})();

  