	var express = require('express');
	var storage = require('./s3');
	var fs = require('fs');
	var app = express();
	var poost = require('./poostesRepository');
	var denounces = require('./denouncesRepository');
	var s3Url = 'https://s3.amazonaws.com/poostes/';
	
	app.use(express.bodyParser({uploadDir:'ui/temp/'}));

	app.engine('.html', require('jade').renderFile);
	
	app.configure(function() {
	    app.use(express.static('ui/'));
	});
	
	app.get('/',function(req,res){
		res.render('ui/index.html');
	});
	
	var pooResponse = function (idImage,artist,masterPiece,pooDay,pooSequence){
		
		this.url = s3Url  + idImage + '.jpg';
		this.artist = artist;
		this.masterPiece = masterPiece;
		this.poostDay = pooDay;
		this.poostSequence = pooSequence;
	
	}
	
	function getPoo(req,res,pooDay,pooSequence){

		poost.get(pooDay,20,pooSequence,function(err,data){
						
			var response = new Array();
			if(data!=null && pooSequence!=null){
				data = data.reverse();
			}
			for(item in data){
				var poost = data[item];
				var id = poost.poostDay.toString() + poost.poostSequence.toString();
				
				var pooItem = new pooResponse(id,
				poost.artist,
				poost.masterPiece,
				poost.poostDay,
				poost.poostSequence);
				
				response.push(pooItem);		
			};

			res.json(response);
		});
	}
	
	app.get('/list/:poostDay/:poostSequence',function(req,res){

		var poostDay = (req.params.poostDay);
		var poostSequence = (req.params.poostSequence)-1;
		
		getPoo(req,res,poostDay,poostSequence);
	});
	
	app.get('/list/:poostDay',function(req,res){
	
			var poostDay = (req.params.poostDay);
			getPoo(req,res,poostDay,null);
	});
	
	app.get('/list',function(req,res){
		getPoo(req,res,null,null);
	});
	
	app.post('/noPoo',function(req,res,next){
		
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
				poost.it(req.body.artist,req.body.masterpiece,ipAddress,function(ex,id,pooDay,pooSequence){
					storage.save(id.toString(),buffer,function(err,data){
					
						if(err){
							res.json(400, 
								{
									error : 'Ooops!!'
								});
						}
						
						res.json(200, {message : 'Okay, your poop was uploaded..thanks for share!'});
						
						var newPoo = new pooResponse(id,
						req.body.artist,
						req.body.masterpiece,
						pooDay,
						pooSequence);
						
						io.sockets.volatile.emit('newPoo' ,newPoo );
					});
				});
			});
		}
		
		var tempPath = req.files.poo.path;
		fs.unlink(tempPath, function(err) {
			if (err) throw err;
		});
	});
	

//		app.listen(port);
	var port =  process.env.PORT || 3000;
	var server = require('http').createServer(app)
	var io = require('socket.io').listen(server);
	
	
	io.configure(function () { 
	  io.set("transports", ["xhr-polling"]); 
	  io.set("polling duration", 10); 
	});
	
	server.listen(port);

	io.sockets.on('connection', function(socket) {});