/*
 * Primary file for the API
 *
 */

// Dependencies
var http = require('http');
var url = require('url');

// The server should respond to all requests w/ a string
var server = http.createServer(function(req, res){

	// Get url and parse
	var parsedUrl = url.parse(req.url, true);

	// Get path
	var trimmedpath = parsedUrl.pathname.replace(/^\/+|\/+$/g,'');

	// Get the HTTP method
	var method = req.method.toLowerCase();

	// Send response
	res.end('Hello World\n');

	// Log the request path
	console.log('req received on path: '+trimmedpath
		+' with method: '+method);
});

// Start the server and have it listen on port 3000
server.listen(3000, function(){
	console.log("The server is listening on port 3000");
});
