//This is an example server. All code in this directory should not be required when using the module. 
var projectY = require('./../init');

var express = require('express');

var app = express();

//the module
app.use('/api', projectY({}));

//serve up some static files
app.use(express.static('public'));

app.listen(3000, function() {
  console.log('Example project listening on port 3000...');
});