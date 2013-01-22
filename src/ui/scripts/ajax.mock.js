

var poostagram = (function(){
    	
	return{
		getMorePoos: function(lastPooId, callback){
			var x = setTimeout(function(){
				callback([
					{ poostDay:'12/12/12',  poostSequence: 1, masterPiece: 'MA QUE Bosta!', artist: 'mario', url: 'img/poos/e.jpg' },
					{ poostDay:'12/12/12',  poostSequence: 4, masterPiece: 'Bosta', artist: 'eu', url: 'img/poos/d.jpg' },
					{ poostDay:'12/12/12',  poostSequence: 2, masterPiece: 'BIG', artist: 'paulo', url: 'img/poos/c.jpg' },
					{ poostDay:'12/12/12',  poostSequence: 3, masterPiece: 'Robinho', artist: 'Victor', url: 'img/poos/b.jpg' }
				]);
			}, 500)
		},
		getMessage:function(callback){
			var x = setTimeout(function () {
				alert('123');
				callback();
			},500);
		}
	};

})();

  