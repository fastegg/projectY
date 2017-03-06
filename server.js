var mongoose = require('mongoose');

var Actions = require('./lib/actions');
var Tables = require('./lib/tables');
var Log = require('./lib/log');

var gReady = false;
var gStarted = false;

function isReady() {
  return gReady;
}

function isStarted() {
  return gStarted;
}

//Config options: {
// mongoAddress: *required* address to mongoDB server
// logger: object requiring the following functions: error, warn, info
//}

function init(config, cb) {
  if (isStarted()) {
    throw 'DB already initated, do not call init twice!';
  }

  if (!config.mongoAddress) {
    throw 'DB address not defined!';
  }

  if (config.logger) {
    if (typeof config.logger.error !== 'function') {
      throw 'logger must have error function';
    }

    if (typeof config.logger.warn !== 'function') {
      throw 'logger must have warn function'; 
    }

    if (typeof config.logger.info !== 'function') {
      throw 'logger must have info function';
    }
    Log.setLogger(config.logger);
  }

  gStarted = true;
  mongoose.connect(config.mongoAddress);
  var db = mongoose.connection;

  db.on('error', function(err) {
    Log.error('connection error:' + err);
    cb(err);
  });

  db.once('open', function() {
    db.on('disconnect', function() {
      Log.error('disconnected from DB!');
    });
    Log.info('connected to DB');
    gReady = true;
    Tables.modelTables();
    cb();
  });
}

var API_COMMANDS = {
  INIT_DB: 'initDB',
};

function use(req, res, next) {
  if (!isReady()) {
    throw 'DB not ready!';
  }

  var cmd = req.path.slice(1);
  var ctx = {};

  switch(cmd) {
  case API_COMMANDS.INIT_DB:
    Tables.initClientDB(ctx, function(err, db) {
      if (err) {
        res.status(400).send(err).end();
      }
      res.status(200).send(db || {}).end();
      next();
    });
    break;
  default:
    res.status(404).send('unknown request').end();
    next();
  }
}

function registerTable(func, tableName, schema) {
  if (isStarted()) {
    throw 'cannot model a table after startup';
  }

  func(tableName, schema);
}

module.exports.init = init;
module.exports.use = use;

module.exports.registerGlobalTable = registerTable.bind(null, Tables.registerGlobalTable);
module.exports.registerAccountTable = registerTable.bind(null, Tables.registerAccountTable);

for (var cmd in Actions) {
  module.exports[cmd] = Actions[cmd];
}