var poost = (function(){
	
	var db = require('./dynamodb');
	
	var tableName = 'poostes';
	var today = new Date();    	
	
	
	function getCurrentId(){
		var day = today.getUTCDate().toString();
		var month = (today.getUTCMonth()+1).toString();
		var year = today.getUTCFullYear().toString();
		
		return parseInt(day.toString()+month.toString()+year.toString());
	};
	
	var getNextSequence  = function(callback){
		
		var id = getCurrentId();
		
		var countPoostesDay = db.get(tableName)
								.query({poostDay: id})
								.count()
								.fetch(function(err,count){
									callback(count+1);
								});		
	}
		
	return {
		
		it:function(artist,masterPiece,ipAddress,callback){	
			getNextSequence(function(sequence){
				db
				.put(tableName,{
									poostDay:getCurrentId(),
								  	poostSequence:sequence,
								  	artist:artist,
								  	masterPiece:masterPiece,
								  	ip: ipAddress,
								  	date:today.toUTCString()})
				.save(function(err){
					callback(err,parseInt(getCurrentId().toString() + sequence.toString()));				
				});			
			});
		},
		delete:function(poostDay,poostSequence,callback){
			 db
			.remove(tableName,{poostDay:day,poostSequence:poostSequence})
			.save(function(err){
				callback(err);
			});
		},
		get:function(day,count,currentCount,callback){
			
			if(day===null){
				day = getCurrentId();
			};
			
			db
			.get(tableName)
			.query({poostDay:day, 
				poostSequence:{
					'>=':[currentCount,(currentCount+count)]
					}
				})
			.get('poostDay','poostSequence','artist','masterPiece','date')
			.fetch(function(err,data){
				callback(err,data);
			});
		}
	}
})()

module.exports = poost;