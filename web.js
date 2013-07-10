var express = require('express');

var app = express.createServer(express.logger());

var buffer = new Buffer(27);
buffer.write(fs.readFileSync("index.html");
var out = buffer.toString('utf-8');

app.get('/', function(request, response) {
  response.send(out);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
