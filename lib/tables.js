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
    gTables.model = mongoose.model(table, gTables[table].schema);  
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

function initClientDB(ctx, cb) {
  var db = {};
  var series = [];

  function appendClientData(tableName, findParams, mask, next) {
    getClientData(tableName, findParams, mask, function(err, docs) {
      if (err) next(err);
      db[tableName] = docs || {};
    });
  }

  for (var table in gTables) {
    switch (gTables[table]) {
    case TABLE_TYPES.GLOBAL:
      series.push(appendClientData, table, null, null);
      break;
    case TABLE_TYPES.ACCOUNT:
      if (!ctx.accountID) {
        break;
      }
      series.push(appendClientData, table, {accountID: ctx.accountID}, null);
      break;
    }
  }

  async.parallel(series, function(err) {
    cb(err, db);
  });
}

module.exports.registerGlobalTable = registerGlobalTable;
module.exports.registerAccountTable = registerAccountTable;
module.exports.modelTables = modelTables;
module.exports.initClientDB = initClientDB;
