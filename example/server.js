//This is an example server. All code in this directory should not be required when using the module. 
var webpackDevServer = require('webpack-dev-server');
var webpack = require('webpack');
var express = require('express');
var winston = require('winston');
var bodyParser = require('body-parser');

var Reflo = require('./../server');
var config = require('./webpack.config');

var app = new webpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
});

app.use(bodyParser.json());

var globalNewsTable = {
  title: String,
  description: String,
};

Reflo.registerGlobalTable('news', globalNewsTable);

function createNewNews(ctx, newsTitle, newsDescription, cb) {
  var newsData = {
    title: newsTitle,
    description: newsDescription,
  };

  Reflo.insertClientData(ctx, ['news'], newsData, cb);
}
Reflo.registerAction('newNews', createNewNews);

var projConfig = {
  mongoAddress: 'mongodb://localhost/test',
};

Reflo.init(projConfig, function() {
  //the module
  app.use('/api', Reflo.use);
  app.listen(3000, function() {
    winston.log('Example project listening on port 3000...'); /* eslint-disable-line */
  });
});

//serve up some static files
app.use('/', express.static('public'));

