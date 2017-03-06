var mongoose = require('mongoose');
var async = require('async');

var gTables = {};

var TABLE_TYPES = {
  GLOBAL: 'global',
  ACCOUNT: 'account',
};

function validateTableName(tableName) {
  if (gTables[tableName]) {
    throw 'cannot have two tables with the same name: ' + tableName;
  }

  if (tableName.indexOf('_') !== -1) {
    throw 'use of underscores in table names is not allowed: ' + tableName;
  }
}

function registerGlobalTable(tableName, schema) {
  validateTableName(tableName);

  gTables[tableName] = {
    schema: mongoose.Schema(schema),
    type: TABLE_TYPES.GLOBAL,
  };
}

function registerAccountTable(tableName, schema) {
  validateTableName(tableName);

  if (!schema.accountID) {
    schema.accountID = String;
  }

  gTables[tableName] = {
    schema:  mongoose.Schema(schema),
    type: TABLE_TYPES.ACCOUNT,
  };
}

function modelTables() {
  for (var table in gTables) {
    gTables[table].model = mongoose.model(table, gTables[table].schema);  
  }
}

function getClientData(tableName, findParams, mask, cb) {
  gTables[tableName].model.find(findParams, mask, function(err, docs) {
    if (err) return cb(err);
    var rtn = {};

    for (var i=0;i<docs.length;i++) {
      rtn[docs[i].id] = docs[i];
    }

    return cb(null, rtn);
  });
}

function insertClientData(ctx, tableName, data, cb) {
  var model = new gTables[tableName].model(data);
  
  model.save(cb);
}

function initClientDB(ctx, cb) {
  var series = {};

  for (var table in gTables) {
    switch (gTables[table].type) {
    case TABLE_TYPES.GLOBAL:
      series[table] = async.apply(getClientData, table, null, null);
      break;
    case TABLE_TYPES.ACCOUNT:
      if (!ctx.accountID) {
        break;
      }
      series[table] = async.apply(getClientData, table, {accountID: ctx.accountID}, null);
      break;
    }
  }

  async.parallel(series, function(err, db) {
    cb(err, db);
  });
}

module.exports.registerGlobalTable = registerGlobalTable;
module.exports.registerAccountTable = registerAccountTable;
module.exports.modelTables = modelTables;
module.exports.initClientDB = initClientDB;
