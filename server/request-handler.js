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


module.exports = function(request, response) {
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  var defaultCorsHeaders = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, accept',
    'access-control-max-age': 10 // Seconds.
  };

  // set headers
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'application/json';

  var statusCode = 200;
  var responseBody = {};

  if (request.method === 'GET' && request.url === '/classes/messages') {
    console.log('GET to classes/messages');

    responseBody = {
      results: []
    };

  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    statusCode = 201;

    var dataPath = path.join(__dirname, 'data.json');

    var data = '';

    var readStream = fs.createReadStream(dataPath, 'utf8')
      .on('data', chunk => { data += chunk; })
      .on('end', () => {
        var parsedData = JSON.parse(data);
        console.log(parsedData.results);
        console.log('*******request******: ', request);
        // parsedData.results.push(message);
        debugger;
      })
      .on('error', (err) => { throw err; });

    // .pipe(ourParseFn).pipe(fs.write)



  } else if (request.method === 'POST' && request.url === '/classes/room') {
    statusCode = 201;
    console.log('post to classes/room');

  } else if (request.method === 'OPTIONS') {
    console.log('post to classes/messages');
    statusCode = 200;

  } else {
    console.log('404');
    response.statusCode = 404;
    response.end();
  }

  response.writeHead(statusCode, headers);
  response.write(JSON.stringify(responseBody), 'utf-8');
  // let body = [];

  // request.on('error', function(err) {
  //   console.error(err);
  // }).on('data', function(chunk) {
  //   body.push(chunk);
  // }).on('end', function() {
  //   body = Buffer.concat(body).toString();
  //   // BEGINNING OF NEW STUFF
  //   console.log({ body });
  //   response.on('error', function(err) {
  //     console.error(err);
  //   });
  // });

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  response.end();
};
