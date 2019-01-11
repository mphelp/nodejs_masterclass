/*
 * Primary file for the API
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const fs = require('fs');

const api = require('./api')

// Instantiate HTTP(S) servers
var httpsServerOptions = {
	'key' : fs.readFileSync('./https/key.pem'),
	'cert' : fs.readFileSync('./https/cert.pem'),
};
var httpServer = http.createServer(function(req, res){
	unifiedServer(req,res);
});
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
	unifiedServer(req,res);
});




// Https and http server logic
var unifiedServer = function(req,res){

	var parsedUrl = url.parse(req.url, true); // true ensures query str is obj not str
	var endpoint = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');
	var queryStrObj = parsedUrl.query;
	var method = req.method.toLowerCase();
	var { headers } = req;

	// Get the payload, if any
	var decoder = new StringDecoder('utf-8');
	var buffer = '';
	req.on('data',function(data){ // request emits a data event we're binding on
		buffer += decoder.write(data);
	})
	req.on('end',function(){
		buffer += decoder.end();

		// Choose handler for this req, default: notfound
		var chosenHandler = typeof(router[endpoint]) !== 'undefined' 
			? router[endpoint] 
			: handlers.notFound;

		// Construct data obj to send to handler
		var data = {
			endpoint,
			queryStrObj,
			method,
			headers,
			'payload' : buffer,
		};
		// Route the request to handler specified in router
		// format: chosenHandler(data, CALLBACK(resp code, resp payload)
		chosenHandler(data, function(statusCode,payload){
			// Use the status code called back by handler or default to 200
			statusCode = typeof(statusCode) === 'number' ? statusCode : 200;
			// Use the payload called by the handler, or default to empty
			payload = typeof(payload) === 'object' ? payload : {};
			// Convert response payload to string
			var payloadStr = JSON.stringify(payload);

			// Return response
			res.setHeader('Content-Type','application/json');
			res.writeHead(statusCode);
			res.end(payloadStr);

			// Log the payload
			console.log('Returning this response: ',statusCode,payloadStr);
		});
	})
};

// Defining handlers
var handlers = {};

// Ping handler
handlers.ping = function(data, callback){
	callback(200);
};
// Not found handler
handlers.notFound = function(data, callback){
	callback(404);
};
// Defining a req router
var router = {
	'ping' : handlers.ping
};


// Start HTTP(S) servers
httpServer.listen(config.httpPort, function(){
	console.log(`The http server is listening on port ${config.httpPort} in ${config.envName} mode`);
});
httpsServer.listen(config.httpsPort, function(){
	console.log(`The https server is listening on port ${config.httpsPort} in ${config.envName} mode`);
});

