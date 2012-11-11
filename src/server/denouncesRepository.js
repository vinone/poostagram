var denounces = (function(){

	var db = require('./dynamodb');
	
	var tableName = 'denounces';
	
	
	return {
		
		get:function(poostDay,poostSequence,callback){
			db
			.get(tableName)
			.query({poostDay:poostDay,
				    poostSequence:poostSequence})
			.get('poostDay','poostSequence','amount')
			.fetch(function(err,data){
				callback(err,data);
			});
		},
		save:function(poostDay,poostSequence){
			
			denounces.get(poostDay,poostSequence,function(err,data){
				
				db
				.put(tableName,{
									poostDay:poostDay,
								  	poostSequence:poostSequence,
								  	amount:data.amount+1,
								  	date:today.toUTCString()})
				.save(function(err){
					callback(err,data.amount+1);				
				});			
				
			});
			
		}
	
	}

});

module.exports = denounces;