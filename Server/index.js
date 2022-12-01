"use strict";

var PORT = 8016

var http = require("http");
var processReq = require("./Modules/processReq.js");
var headers = require("./Modules/headers.js");

http.createServer(function(request, response) {
	switch(request.method){
		case "GET":
			processReq.processGetRequest(request, response);
			break;
		case "POST":
			processReq.processPostRequest(request, response);
			break;
		default:
			response.writeHead(501, headers["plain"]);
			response.end();
			break;
	}
}).listen(PORT);

console.log("Server running at localhost:8016");
