var gActionTable = {};

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;

function getParamNames(func) {
  var fnStr = func.toString().replace(STRIP_COMMENTS, '');
  var result = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
  if(result === null)
    result = [];
  return result;
}

function registerAction(actionName, func) {
  if (gActionTable[actionName]) {
    throw 'cannot define actions of the same name: ' + actionName;
  }

  var params = getParamNames(func);

  if (params.length < 2) {
    throw 'action does not have enough parameters, must include both ctx and cb parmas: ' + actionName;
  }

  if (params[0] !== 'ctx') {
    throw 'action must have ctx as first parameter: ' + actionName;
  }

  if (params[params.length-1] !== 'cb') {
    throw 'action must have cb as last parameter: ' + actionName;
  }

  params = params.slice(1,-1);

  gActionTable[actionName] = {
    params: params,
    func: func,
  };
}

function executeAction(ctx, actionName, params, cb) {
  var action = gActionTable[actionName];

  if (!action) {
    return cb('unknown action: ' + actionName);
  }

  var applyParams = [];
  applyParams.push(ctx);
  
  for (var i=0;i<action.params.length;i++) {
    applyParams.push(params[action.params[i]] || null);
  }

  applyParams.push(cb);
  
  action.func.apply(null, applyParams);
}

module.exports.registerAction = registerAction;
module.exports.executeAction = executeAction;