var flux = require('flux');
var fluxUtils = require('flux/utils');
var Immutable = require('immutable');
var xhr = require('xhr');

var ActionTypes = require('./lib/ActionTypes');

var dispatcher = new flux.Dispatcher();
var ReduceStore = fluxUtils.ReduceStore;

ReduceStore.prototype.reduce = function(state, action) {
  switch (action.type) {
  case ActionTypes.INIT_DB:
    state = Immutable.fromJS(action.data);
    return state;
  case ActionTypes.ACTION_RESPONSE:
    for (var i=0;i<action.data.length;i++) {
      var update = action.data[i];

      switch(update.action) {
      case 'INSERT':
        state = state.setIn(update.path, update.data);
        break;
      case 'MODIFY':
        state = state.updateIn(update.path, update.data);
        break;
      case 'DELETE':
        state= state.setIn(update.path, undefined);
        break;
      }
    }
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

function post(command, body, cb) {
  var options = {
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  xhr.post('/api/' + command, options, function(err, resp) {
    if (err) return cb(err);

    if (resp.statusCode !== 200) {
      return cb(resp.body);
    }

    return cb(null, JSON.parse(resp.body));
  });
}

function init() {
  post('initDB', null, function(err, result) {
    if (err) return window.alert(err);

    dispatcher.dispatch({type: ActionTypes.INIT_DB, data: result});
  });
}

function runAction(actionName, params, cb) {
  post('runAction', {action: actionName, params: params}, function(err, result) {
    if (err) {
      return cb && cb(err);
    }
    dispatcher.dispatch({type: ActionTypes.ACTION_RESPONSE, data: result.updates});
    cb && cb(null, result);
  });
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

exports.init = init;
exports.store = store;
exports.connectAll = connectAll;
exports.connect = connect;
exports.runAction = runAction;