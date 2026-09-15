var port = process.argv.splice(2)[0] || 8089;
var express = require('express'),
  path = require('path'),
  app = express(),
  server = require('http').createServer(app).listen(port, '0.0.0.0');


app.use(express.static(path.join(__dirname, './')));

console.log("Local server is running with :"+port +" port if you want you can change other server");
