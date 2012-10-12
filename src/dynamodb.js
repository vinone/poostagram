var dynamodb = (function(){

	var dynamo  = require("dynamo");
	var credentials = require("./credentials");
	
	var client  = dynamo.createClient({
			accessKeyId: 		credentials.accessKey,
			secretAccessKey: 	credentials.secretKey 
	});
	
	var db = client.get("us-east-1");
	
	
	return {
		db:db
	}
	
	
})()

module.exports = dynamodb.db;
