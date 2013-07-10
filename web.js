var express = require('express');

var app = express.createServer(express.logger());
/*
var buffer = new Buffer(27);
buffer.write(fs.readFileSync("index.html", "utf8");
var out = buffer.toString('utf8');

var out = fs.readFileSync("index.html", 'utf8');
*/
app.get('/', function(request, response) {
  response.send(fs.readFileSync("index.html", 'utf-8');
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
