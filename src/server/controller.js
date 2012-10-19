		

	var express = require('express');
	var storage = require('./s3');
	var fs = require('fs');
	var app = express();

	var poost = require('./repository');
	app.use(express.bodyParser({uploadDir:'./temp_poo'}));


	app.engine('.html', require('jade').renderFile);
	
	app.configure(function() {
	    app.use(express.static('../ui/'));
	});
	
	app.get('/',function(req,res){
		res.render('../ui/html/index.html');
	});

	app.get('/list/{poostDay}/{poostSequence}',function(req,res){
		poost.get(req.poostDay,20,req.poostSequence,function(err,data){
	
			var response = new Array();
			
			for(item in data){
				var poost = data[item];
				var id = poost.poostDay.toString() + poost.poostSequence.toString() + '.jpg';

				response.push({url: '<img src="https://s3.amazonaws.com/poostes/' + id + '"',
						artist: poost.artist,
						masterpiece: poost.masterPiece,
						poostDay:poost.poostDay.toString(),
						poostSequence:poost.poostDay.toString()});		
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
	app.listen(801);

