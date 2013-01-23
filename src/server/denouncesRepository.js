var denounces = (function(){

	var db = require('./dynamodb');
	
	var tableName = 'denounces';
	var today = new Date();
	
	return {
		
		get:function(poostDay,poostSequence,callback){
			var query = db
			.get(tableName)
			.query({poostDay:parseInt(poostDay),
				    poostSequence:parseInt(poostSequence)})
			.get('poostDay','poostSequence','amount');
			
			
			query.fetch(function(err,data){
				callback(err,data);
			});
		},
		delete:function(poostDay,poostSequence,callback){
			 var poo = db.get(tableName,{	
										poostDay:parseInt(poostDay),
										poostSequence:parseInt(poostSequence)
									});
			 poo.destroy(function(err,data){
			 	callback(err,data);
			 });
		},
		save:function(poostDay,poostSequence,callback){
			
			denounces.get(poostDay,poostSequence,function(err,data){
				
				var amount = 1;
				
				
				if(data!=undefined  && data[0]!=undefined){
					if(data[0].amount!=undefined){
						amount = data[0].amount + 1;
					}
				}

				db
				.put(tableName,{
									poostDay:parseInt(poostDay),
								  	poostSequence:parseInt(poostSequence),
								  	amount:parseInt(amount),
								  	date:today.toUTCString()})
				.save(function(err){
					callback(err,amount);				
				});			
				
			});
			
		}
	
	}

})();

module.exports = denounces;