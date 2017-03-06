var gActionTable = {};

function registerAction(actionName, params, func) {
  if (gActionTable[actionName]) {
    throw 'cannot define actions of the same name: ' + actionName;
  }

  gActionTable[actionName] = {
    params: params,
    func: func,
  };
}

function executeAction(ctx, actionName, params, cb) {
  if (!gActionTable[actionName]) {
    return cb('unknown action');
  }
  ctx;
  actionName;
  params;
}

module.exports.registerAction = registerAction;
module.exports.executeAction = executeAction;