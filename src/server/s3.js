var storage = (function(){
	
	
	var credentials = require('./credentials');
	var knox = require('knox');
	

	var client = knox.createClient({
	    key: credentials.accessKey
	  , secret: credentials.secretKey
	  , bucket: 'poostes'
	});
	
	var headers = {
	  'Content-Type': 'image/jpg',
	  'x-amz-acl' :'public-read'
	};
	
	return {
	
		save:function(id,buffer,callback){
			
			client.putBuffer(buffer, id+'.jpg', headers, function(err, res){
			  	callback(err,res);
			});
		
		},
		delete:function(id){
			console.log(id);
			client.deleteFile(id + '.jpg',headers,function(err){});
		}
	}

})();

module.exports = storage;
