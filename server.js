#!/usr/bin/env node
var http = require("http"),
		https = require("https"),
    url = require("url"),
    path = require("path"),
    fs = require("fs"),
    port = process.argv[2] || 8888;

http.createServer(function(request, response) {

  var parsed = url.parse(request.url),
		uri = parsed.pathname,
    filename = path.join(process.cwd(), uri);
  

  path.exists(filename, function(exists) {
    if(!exists) {
      response.writeHead(404, {"Content-Type": "text/plain"});
      response.write("404 Not Found\n");
      response.end();
      return;
    }

	if (fs.statSync(filename).isDirectory()) filename += 'index.html';

    fs.readFile(filename, "binary", function(err, file) {
      if(err) {        
        response.writeHead(500, {"Content-Type": "text/plain"});
        response.write(err + "\n");
        response.end();
        return;
      }

      fs.stat(filename, function(err, stats) {
        if(typeof stats !== "undefined" && stats !== null) {
          response.setHeader("Last-Modified", stats.mtime);
          response.writeHead(200);
          if(request.method !== "HEAD")
            response.write(file, "binary");
          response.end();
        }
      });
    });
  });
}).listen(parseInt(port, 10));

console.log("Static file server running at\n  => http://localhost:" + port + "/\nCTRL + C to shutdown");
