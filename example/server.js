//This is an example server. All code in this directory should not be required when using the module. 
var projectY = require('./../index');

var express = require('express');

var app = express();

var globalNewsTable = {
  title: String,
  description: String,
};

projectY.registerGlobalTable('news', globalNewsTable);

var projConfig = {
  mongoAddress: 'mongodb://localhost/test',
};

projectY.init(projConfig, function() {
  //the module
  app.use('/api', projectY.use);
  app.listen(3000, function() {
    console.log('Example project listening on port 3000...');
  });
});

//serve up some static files
app.use(express.static('public'));

