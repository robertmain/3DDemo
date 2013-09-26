var express = require('express'),
	cons = require('consolidate'),
	app = express(),
	packageFile = require('./package.json'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	os = require('os');
	var port = process.argv[2] || 8000;
	var ip = os.networkInterfaces()['eth0'][0].address;
	io.sockets.on('connection', function(socket){
		socket.on('rotate', function(data){
			var axes = {};
			var precision = 0;
			axes.a = precision*Math.round(data.a/precision);
			axes.b = precision*Math.round(data.b/precision);
			axes.g = precision*Math.round(data.g/precision);
			socket.broadcast.emit('rotate', data);
		})
	});

app.configure(function() {
	app.engine('htm', cons.just);
	app.set('view engine', 'htm');
	app.set('views', __dirname + '/public');
	app.use(express.static("public"));
});

app.get("/", function(req, res) {
	var data = {};
	data.packageFile = packageFile;
	data.ip = ip;
	data.port = port;
	res.render("index", data);
});

app.get("/demo1", function(req, res) {
	var data = {};
	data.packageFile = packageFile;
	res.render("demo1", data);
});

app.get("/demo2", function(req, res) {
	var data = {};
	data.packageFile = packageFile;
	res.render("demo2", data);
});


app.get("/phone", function(req, res) {
	var data = {};
	io.sockets.emit('start_demo', {});
	data.packageFile = packageFile;
	res.render("phone", data);
});
server.listen(port);
console.log(packageFile.name + " Server Now Running On Port " + ip + ":" + port + "...");