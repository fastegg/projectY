var flux = require('flux');
var fluxUtils = require('flux/utils');
var Immutable = require('immutable');

var ActionTypes = require('./lib/ActionTypes');

var dispatcher = new flux.Dispatcher();
var ReduceStore = fluxUtils.ReduceStore;

ReduceStore.prototype.reduce = function(state, action) {
  switch (action.type) {
  case ActionTypes.INIT_DB:
    state = Immutable.fromJS(action.data);
    return state;
  default:
    return state;
  }
};

ReduceStore.prototype.getInitialState = function() {
  return {
    _loadingDB: true,
  };
};

var store = new ReduceStore(dispatcher);

function initDB(db) {
  dispatcher.dispatch({type: ActionTypes.INIT_DB, data: db});
}

function getStores() {
  return [store];
}

function calculateState() {
  return {db: store.getState()};
}

function connectAll(view, options) {
  return fluxUtils.Container.createFunctional(view, getStores, calculateState, options);
}

function connect(view, options) {
  return fluxUtils.Container.create(view, options);
}

window._DB = store;

exports.store = store;
exports.connectAll = connectAll;
exports.connect = connect;
exports.initDB = initDB;