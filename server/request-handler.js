const fs = require('fs');
const path = require('path');

/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/


module.exports.requestHandler = function(request, response) {
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var defaultCorsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };

  // set headers
  var headers = defaultCorsHeaders;
  var dataPath = path.join(__dirname, 'data.json');

  if (request.method === 'GET' && request.url === '/classes/messages') {
    headers['Content-Type'] = 'application/json';
    response.writeHead(200, headers);

    fs.readFile(dataPath, 'utf8', (error, data) => {
      response.end(data);
    });

  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    response.writeHead(201, headers);

    var postData = '';
    var dataPath = path.join(__dirname, 'data.json');

    request.on('data', data => {
      postData += data;
    });

    request.on('end', () => {
      var message = JSON.parse(postData);
      message.createdAt = new Date( Date.now() );

      fs.readFile(dataPath, 'utf8', (error, data) => {
        var parsedData = JSON.parse(data);
        parsedData.results.unshift(message);

        fs.writeFile(dataPath, JSON.stringify(parsedData), 'utf8', (err) => {
          if (err) { throw err; }
          console.log('wrote new data!');
          response.end(data);
        });
      });
    });

  } else if (request.method === 'POST' && request.url === '/classes/room') {
    response.writeHead(201, headers);
    response.end();

  } else if (request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();

  } else {
    response.writeHead(404, headers);
    response.end();
  }
};
