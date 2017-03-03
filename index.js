var mongoose = require('mongoose');

var Actions = require('./lib/actions');
var Tables = require('./lib/tables');

var gReady = false;
var gStarted = false;

function isReady() {
  return gReady;
}

//Config options: {
// mongoAddress: *required* address to mongoDB server
//}

function init(config, cb) {
  if (gStarted) {
    throw 'DB already initated, do not call init twice!';
  }

  if (!config.mongoAddress) {
    throw 'DB address not defined!';
  }

  gStarted = true;
  mongoose.connect(config.mongoAddress);
  var db = mongoose.connection;

  db.on('error', function(err) {
    console.error('connection error:' + err);
    cb(err);
  });

  db.once('open', function() {
    db.on('disconnect', function() {
      console.error('disconnected from DB!');
    });
    console.log('connected to DB');
    gReady = true;
    Tables.modelTables();
    cb();
  });
}

var API_COMMANDS = {
  INIT_DB: 'initDB',
}

function use(req, res, next) {
  if (!gReady) {
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
        res.status(200).send(JSON.stringify(db ? db : {})).end();
      });
    break;
    default:
      res.status(404).send('unknown request').end();
  }
}

function registerTable(func, tableName, schema) {
  if (gStarted) {
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
