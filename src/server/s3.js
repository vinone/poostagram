var storage = (function(){
	
	
	var credentials = require('./credentials');
	var knox = require('knox');
	
	
	var client = knox.createClient({
	    key: credentials.accessKey
	  , secret: credentials.secretKey
	  , bucket: 'poostes'
	});
	
	
	return {
	
		save:function(id,buffer,callback){
			
			var headers = {
			  'Content-Type': 'image/jpg',
			  'x-amz-acl' :'public-read'
			};
			
			client.putBuffer(buffer, id+'.jpg', headers, function(err, res){
			  	callback(err,res);
			});
		
		}
	
	}

})();

module.exports = storage;
