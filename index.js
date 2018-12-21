/*
 * Primary file for the API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');
var { StringDecoder } = require('string_decoder');

// The server should respond to all requests w/ a string
var server = http.createServer(function(req, res){

	// Get url and parse
	var parsedUrl = url.parse(req.url, true); // true ensures query str is obj not str

	// Get path
	var trimmedpath = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');

	// Get the query string as an object
	var queryStrObj = parsedUrl.query;

	// Get the HTTP method
	var method = req.method.toLowerCase();

	// Get req headers as obj
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
		var chosenHandler = typeof(router[trimmedpath]) !== 'undefined' ? router[trimmedpath] : handlers.notFound;

		// Construct data obj to send to handler
		var data = {
			trimmedpath,
			queryStrObj,
			method,
			headers,
			'payload' : buffer,
		};
		// send response
		res.end('Hello world\n');

		// Log the payload
		console.log('Request received w/ payload:',buffer);
	})
});

// Start the server and have it listen on port 3000
server.listen(3000, function(){
	console.log("The server is listening on port 3000");
});






// Defining handlers
var handlers = {};

// Sample handler
handlers.sample = function(data, callback){
	// Callback http status code, and a payload obj		
	callback(406, {'name': 'sample handler'});
};
// Not found handler
handlers.notFound = function(data, callback){
	callback(404);
};
// Defining a req router
var router = {
	'sample' : handlers.sample
};
