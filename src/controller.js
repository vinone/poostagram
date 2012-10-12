	var express = require('express');
	var storage = require('./s3');
	var fs = require('fs');
	var app = express();
	var poost = require('./repository');
	app.use(express.bodyParser({uploadDir:'./temp_poo'}));
	
	app.get('/index',function(req,res){
		res.send("<h1>Poost It</h1>");
	});

	app.get('/upload',function(req,res){
		res.writeHead(200,{"Content-Type":"text/html"});
		res.write('<form action="/upload" method="post" enctype="multipart/form-data">' +
			'<input type="text" name="artist">' +
			'<input type="text" name="masterpiece">' +
			'<input type="file" name="maybeAPooImage">' +
			'<input type="submit" value="Poost It!">' +
			'</form>' + 
			'<a href="/list/">list all</a>');
		res.end();
	});
	
	app.get('/list',function(req,res){
		poost.get(12102012,20,0,function(err,data){
	
			var response = new Array();
			
			for(item in data){
				var poost = data[item];
				var id = poost.poostDay.toString() + poost.poostSequence.toString() + '.jpg';

				response.push({url: '<img src="https://s3.amazonaws.com/poostes/' + id + '"',
						artist: poost.artist,
						masterpiece: poost.masterPiece});		
			};

			res.json(response);
		});
	});

	app.post('/upload',function(req,res,next){
		
		if(req.files.maybeAPooImage.size > 700000){ 
			res.json(400, {error : 'Ooops, file too big! Help us, poost a image less than 700000kb'});
		}
		else{	
			fs.readFile(req.files.maybeAPooImage.path,function(error,bufferData){
				var buffer = new Buffer(bufferData);
				poost.it(req.body.artist,req.body.masterpiece,function(ex,id){
					storage.save(id.toString(),buffer,function(err,data){
						res.json(200, {message : 'Okay, your poop was uploaded..thanks for share!'});
					});
				});
			});
		}
		
		var tempPath = req.files.maybeAPooImage.path;
		fs.unlink(tempPath, function(err) {
			if (err) throw err;
		});
	});

	app.listen(8080);
