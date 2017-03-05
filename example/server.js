//This is an example server. All code in this directory should not be required when using the module. 
var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var express = require('express');

var lib = require('./../index');
var config = require('./webpack.config');

var app = new webpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
});

var globalNewsTable = {
  title: String,
  description: String,
};

lib.registerGlobalTable('news', globalNewsTable);

var projConfig = {
  mongoAddress: 'mongodb://localhost/test',
};

lib.init(projConfig, function() {
  //the module
  app.use('/api', lib.use);
  app.listen(3000, function() {
    console.log('Example project listening on port 3000...'); // eslint-disable-line
  });
});

//serve up some static files
app.use('/', express.static('public'));

