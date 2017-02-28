
var gReady = false;

function isReady() {
  return gReady;
}

//Config options: {
// mongoServer: address to mongoDB server
// dbName: name of mongo database
//}

function init(config, cb) {
  //todo: connect to mongo and setup all tables
  gReady = true;
  return function(req, res, next) {
    var path = req.path;

    console.log(path);

    res.send('asking for a request from projectY: ' + path);
    res.end();
  }
}

module.exports = init;