/**************************************
 *
 * Use for testing the EnviroReport meteor app.
 * Run with 'node'
 *
 *************************************/

var http = require('http');

var options = {
	hostname: 'localhost',
	port: 3000,
	path: '/api/points',
	method: 'POST'
};

var now;
var temperature;
var humidity;
var t;
var req = null;

setInterval(function() {

	req = http.request(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		console.log('HEADERS: ' + JSON.stringify(res.headers));
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('BODY: ' + chunk);
		});
	});

	req.on('error', function(e) {
		console.log('problem with request: ' + e.message);
	});

	// write data to request body
	temperature = Math.floor((Math.random() * 100) + 1);;
	humidity = Math.floor((Math.random() * 100) + 1);;
	now = new Date();
	console.log('Time:', now, 'Degrees:', temperature + 'F', 'Humidity:', humidity + '%RH');
	t = {
		temp: temperature,
		humidity: humidity,
		time: now.toJSON()
	};
	req.write(JSON.stringify(t));
	req.end();

}, 1000);
