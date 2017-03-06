var xhr = require('xhr');
var App = require('./App.jsx');

var Reflo = require('./../../index.js');

App.showLoadingScreen();

xhr.post('/api/initDB', {'Content-Type': 'application/json'}, function(err, resp) {
  if (err) return window.alert(err);

  Reflo.initDB(JSON.parse(resp.body));
});
