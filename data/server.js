
var poost = require("./repository");

var express = require("express");
var app = express();

app.get('/poost/it',function(req,res){
	
	poost.it('teste','teste de bosta',function(err,id){
		res.send("<h1>Err:" + err + "</h1> </br> <h2>" + id + "</h2>");		
	});

});

app.get('/poost/list',function(req,res){
	
	poost.get(20,0,function(err,data){
	
		var response = "";
		
		for(item in data){
			
			var poost = data[item];
			
			response += '<h1> poostDay:' + 	poost.poostDay + '</h1>';
			response += '</br>' + poost.poostSequence;
			response += '</br>' + poost.artist;
			response += '</br>' + poost.masterPiece;
			response += '</br>' + poost.date;
			response += '<p> ------- </p>';
		
		};
		res.send(response);
	
	});
});


app.listen(3000);