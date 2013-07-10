var express=require('express'), fs=require('fs');

var app = express.createServer(express.logger());

var buffer = new Buffer(28);
buffer.write(fs.readFileSync("./index.html", 'utf8');
var out = buffer.toString('utf8');

app.get('/', function(request, response) {
  response.send("Hi, I am here!");
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
