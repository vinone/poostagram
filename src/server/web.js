		

	var express = require('express');
	var storage = require('./s3');
	var fs = require('fs');
	var app = express();

	var poost = require('./poostesRepository');
	var denounces = require('./denouncesRepository');
	
	app.use(express.bodyParser({uploadDir:'ui/temp/'}));


	app.engine('.html', require('jade').renderFile);
	
	app.configure(function() {
	    app.use(express.static('ui/'));
	});
	
	app.get('/',function(req,res){
		res.render('ui/index.html');
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
						poostSequence:poost.poostDay.toString()
					});		
			};

			res.json(response);
		});
	});
	
	app.post('/notPool',function(req,res,next){
		
		denounces.save(req.body.poostDay,req.body.poostSequence,function(err,data){
		
			if(data>=20){
				poost.delete(req.body.poostDay,req.body.poostSequence,function(err){
					storage.delete(req.body.poostDay.toString()+req.body.poostSequence.toString());
				})
			}
			
		
			res.json(200, {message : 'Thanks! Have we talked about ' + data + ' times that not a poo!'});
		});
		
	});
	
	app.post('/upload',function(req,res,next){

		if(req.files.poo.size > 700000){ 
			res.json(400, {error : 'Ooops, file too big! Help us, poost a image less than 700000kb'});
		}
		else{	
			fs.readFile(req.files.poo.path,function(error,bufferData){
				var buffer = new Buffer(bufferData);
				var ipAddress = req.header('x-forwarded-for') || req.connection.remoteAddress;
				console.log(ipAddress);
				poost.it(req.body.artist,req.body.masterpiece,ipAddress,function(ex,id){
					storage.save(id.toString(),buffer,function(err,data){
					
						if(err){
							res.json(400, 
								{
									error : 'Ooops!!'
								});
						}
					
						res.json(200, {message : 'Okay, your poop was uploaded..thanks for share!'});
					});
				});
			});
		}
		
		var tempPath = req.files.poo.path;
		fs.unlink(tempPath, function(err) {
			if (err) throw err;
		});
	});
	
	var port =  process.env.PORT || 3000;
		app.listen(port);
