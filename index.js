
var gReady = false;
var gStarted = false;

function isReady() {
  return gReady;
}

//Config options: {
// mongoServer: address to mongoDB server
// dbName: name of mongo database
//}

function init(config, cb) {
  if (gStarted) {
    throw 'DB already initated, do not call init twice!';
  }
  gStarted = true;

  //todo: connect to mongo and setup all tables
  gReady = true;
}

function use(req, res, next) {
  if (!gReady) {
    throw 'DB not ready!';
  }

  var path = req.path;

  console.log(path);

  res.send('asking for a request from projectY: ' + path);
  res.end();

  next();
}

module.exports.init = init;
module.exports.use = use;