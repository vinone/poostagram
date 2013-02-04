var Poo = (function(day,sequence,artistName,masterPieceDescription,data){

	var _dayId 		= day===null 		? new Date() : day;
	var _sequence 	= sequence === null ? 1 		 : sequence;

	return{
		id:function(){
			return{
				day:function(){
					return _dayId;
				},
				sequence:function(){
					return _sequence;
				}
			}
		},
		artist:function(){
			return{
				name:function(){
					return artistName;
				}
			}	
		},
		masterPiece:function(){
			return{
				description:function(){
					return masterPieceDescription;
				}
			}
		}
	}

})

var pooRepository = (function(){

	var _tableName = 'poostes';
	var _dbInstance = require('./dynamodb');
	var _today = new Date();
	var _utils = require('./utils');
	
	function _pagination(sequence,count){
		
		var firstItem = parseInt(sequence) - parseInt(count);
		
		if(firstItem<0){
			firstItem = 0;
		}
		
		var lastItem = parseInt(sequence);
		
		return{
			firstItem:firstItem,
			lastItem:lastItem
		}
	}
	
	function _countItens(day,callback){
	
		day = _utils.toNumber(day);

		_dbInstance.get(_tableName)
		.query({pooDay: day})
		.count()
		.fetch(function(err,count){
			if(err!==null){
				callback.error(err);
			}
			else{
				callback.success(count);
			}
		});
	};	
	
	function _resultToArray(data){
	
		var _poos = new Array();
		
		for(item in data){
			var _item = data[item];
			var _poo = new Poo(	_item.pooDay,
								_item.pooSequence,
								_item.artist,
								_item.masterPiece,
								_item.date);
			_poos.push(_poo);
		}
		return _poos;
	};
	
	function _get(day,pagination,callback){
		
		var _day = _utils.toNumber(day);
		console.log(_day);
		_dbInstance.get(_tableName)
			.query({
				pooDay:_day, 
				pooSequence:{
					'>=':[0,20]
					}
				})
		.get(	'pooDay',
				'pooSequence',
				'artist',
				'masterPiece',
				'date')
		.fetch(function(err,data){
				console.log(data);
				if(data[0]===undefined){
					_get(_utils.last(day),pagination,callback);
				}
				
				var _poos = _resultToArray(data);
				if(err!==null){
					callback.error(err);
				}
				else{
					callback.success(_poos);
				}
		 });
	}
	
	return{
		
		get:function(maxItens){
			return{
				all:function(callBack){	
			  		_countItens(_today,{
			  			success:function(data){
			  				var pagination = _pagination(data,maxItens);
			  				_get(_today,pagination,callBack);
			  			},error:function(err){
			  				callBack.error(err);
			  			}
					})
				},
				byDay:function(day){
					_countItens(day,function(countItens){
						var pagination = _pagination(maxItens,countItens);
						_get(day,pagination,callback);
					});
					
				},
				byDayAndSequence:function(day,sequence){
					var pagination = _pagination(maxItens,sequence);
					_get(day,pagination,callback);	
					
				}
			}		
		},
		put:function(poo,ipAddress,callback){
			_dbInstance.put(_tableName,
			{
				poostDay:poo.id.day().toNumber(),
			  	poostSequence:poo.id.sequence(),
			  	artist:poo.artist.name(),
			  	masterPiece:poo.masterPiece.description(),
			  	ip: ipAddress,
			  	date:poo.id.day().toUTCString()
			})
			.save(function(err){
				callback.sucess(poo);
				if(err){
					callback.error(err);
				}				
			});		
		},
		remove:function(poo){
			
		}
	}
})()

module.exports = pooRepository;