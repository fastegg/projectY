/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = this["webpackHotUpdate"];
/******/ 	this["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest() { // eslint-disable-line no-unused-vars
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = 10000;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "59819ac14fcafaee7bd9"; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest().then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			hotApply(hotApplyOnUpdate).then(function(result) {
/******/ 				deferred.resolve(result);
/******/ 			}, function(err) {
/******/ 				deferred.reject(err);
/******/ 			});
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 				var callbacks = [];
/******/ 				for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 					dependency = moduleOutdatedDependencies[i];
/******/ 					cb = module.hot._acceptedDependencies[dependency];
/******/ 					if(callbacks.indexOf(cb) >= 0) continue;
/******/ 					callbacks.push(cb);
/******/ 				}
/******/ 				for(i = 0; i < callbacks.length; i++) {
/******/ 					cb = callbacks[i];
/******/ 					try {
/******/ 						cb(moduleOutdatedDependencies);
/******/ 					} catch(err) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "accept-errored",
/******/ 								moduleId: moduleId,
/******/ 								dependencyId: moduleOutdatedDependencies[i],
/******/ 								error: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err;
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return Promise.resolve(outdatedModules);
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/builds/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(3)(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

eval("!function() {\n    'use strict';\n    function VNode() {}\n    function h(nodeName, attributes) {\n        var lastSimple, child, simple, i, children = EMPTY_CHILDREN;\n        for (i = arguments.length; i-- > 2; ) stack.push(arguments[i]);\n        if (attributes && null != attributes.children) {\n            if (!stack.length) stack.push(attributes.children);\n            delete attributes.children;\n        }\n        while (stack.length) if ((child = stack.pop()) && void 0 !== child.pop) for (i = child.length; i--; ) stack.push(child[i]); else {\n            if (child === !0 || child === !1) child = null;\n            if (simple = 'function' != typeof nodeName) if (null == child) child = ''; else if ('number' == typeof child) child = String(child); else if ('string' != typeof child) simple = !1;\n            if (simple && lastSimple) children[children.length - 1] += child; else if (children === EMPTY_CHILDREN) children = [ child ]; else children.push(child);\n            lastSimple = simple;\n        }\n        var p = new VNode();\n        p.nodeName = nodeName;\n        p.children = children;\n        p.attributes = null == attributes ? void 0 : attributes;\n        p.key = null == attributes ? void 0 : attributes.key;\n        if (void 0 !== options.vnode) options.vnode(p);\n        return p;\n    }\n    function extend(obj, props) {\n        for (var i in props) obj[i] = props[i];\n        return obj;\n    }\n    function cloneElement(vnode, props) {\n        return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);\n    }\n    function enqueueRender(component) {\n        if (!component.__d && (component.__d = !0) && 1 == items.push(component)) (options.debounceRendering || setTimeout)(rerender);\n    }\n    function rerender() {\n        var p, list = items;\n        items = [];\n        while (p = list.pop()) if (p.__d) renderComponent(p);\n    }\n    function isSameNodeType(node, vnode, hydrating) {\n        if ('string' == typeof vnode || 'number' == typeof vnode) return void 0 !== node.splitText;\n        if ('string' == typeof vnode.nodeName) return !node._componentConstructor && isNamedNode(node, vnode.nodeName); else return hydrating || node._componentConstructor === vnode.nodeName;\n    }\n    function isNamedNode(node, nodeName) {\n        return node.__n === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();\n    }\n    function getNodeProps(vnode) {\n        var props = extend({}, vnode.attributes);\n        props.children = vnode.children;\n        var defaultProps = vnode.nodeName.defaultProps;\n        if (void 0 !== defaultProps) for (var i in defaultProps) if (void 0 === props[i]) props[i] = defaultProps[i];\n        return props;\n    }\n    function createNode(nodeName, isSvg) {\n        var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);\n        node.__n = nodeName;\n        return node;\n    }\n    function removeNode(node) {\n        if (node.parentNode) node.parentNode.removeChild(node);\n    }\n    function setAccessor(node, name, old, value, isSvg) {\n        if ('className' === name) name = 'class';\n        if ('key' === name) ; else if ('ref' === name) {\n            if (old) old(null);\n            if (value) value(node);\n        } else if ('class' === name && !isSvg) node.className = value || ''; else if ('style' === name) {\n            if (!value || 'string' == typeof value || 'string' == typeof old) node.style.cssText = value || '';\n            if (value && 'object' == typeof value) {\n                if ('string' != typeof old) for (var i in old) if (!(i in value)) node.style[i] = '';\n                for (var i in value) node.style[i] = 'number' == typeof value[i] && IS_NON_DIMENSIONAL.test(i) === !1 ? value[i] + 'px' : value[i];\n            }\n        } else if ('dangerouslySetInnerHTML' === name) {\n            if (value) node.innerHTML = value.__html || '';\n        } else if ('o' == name[0] && 'n' == name[1]) {\n            var useCapture = name !== (name = name.replace(/Capture$/, ''));\n            name = name.toLowerCase().substring(2);\n            if (value) {\n                if (!old) node.addEventListener(name, eventProxy, useCapture);\n            } else node.removeEventListener(name, eventProxy, useCapture);\n            (node.__l || (node.__l = {}))[name] = value;\n        } else if ('list' !== name && 'type' !== name && !isSvg && name in node) {\n            setProperty(node, name, null == value ? '' : value);\n            if (null == value || value === !1) node.removeAttribute(name);\n        } else {\n            var ns = isSvg && name !== (name = name.replace(/^xlink\\:?/, ''));\n            if (null == value || value === !1) if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase()); else node.removeAttribute(name); else if ('function' != typeof value) if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value); else node.setAttribute(name, value);\n        }\n    }\n    function setProperty(node, name, value) {\n        try {\n            node[name] = value;\n        } catch (e) {}\n    }\n    function eventProxy(e) {\n        return this.__l[e.type](options.event && options.event(e) || e);\n    }\n    function flushMounts() {\n        var c;\n        while (c = mounts.pop()) {\n            if (options.afterMount) options.afterMount(c);\n            if (c.componentDidMount) c.componentDidMount();\n        }\n    }\n    function diff(dom, vnode, context, mountAll, parent, componentRoot) {\n        if (!diffLevel++) {\n            isSvgMode = null != parent && void 0 !== parent.ownerSVGElement;\n            hydrating = null != dom && !('__preactattr_' in dom);\n        }\n        var ret = idiff(dom, vnode, context, mountAll, componentRoot);\n        if (parent && ret.parentNode !== parent) parent.appendChild(ret);\n        if (!--diffLevel) {\n            hydrating = !1;\n            if (!componentRoot) flushMounts();\n        }\n        return ret;\n    }\n    function idiff(dom, vnode, context, mountAll, componentRoot) {\n        var out = dom, prevSvgMode = isSvgMode;\n        if (null == vnode) vnode = '';\n        if ('string' == typeof vnode) {\n            if (dom && void 0 !== dom.splitText && dom.parentNode && (!dom._component || componentRoot)) {\n                if (dom.nodeValue != vnode) dom.nodeValue = vnode;\n            } else {\n                out = document.createTextNode(vnode);\n                if (dom) {\n                    if (dom.parentNode) dom.parentNode.replaceChild(out, dom);\n                    recollectNodeTree(dom, !0);\n                }\n            }\n            out.__preactattr_ = !0;\n            return out;\n        }\n        if ('function' == typeof vnode.nodeName) return buildComponentFromVNode(dom, vnode, context, mountAll);\n        isSvgMode = 'svg' === vnode.nodeName ? !0 : 'foreignObject' === vnode.nodeName ? !1 : isSvgMode;\n        if (!dom || !isNamedNode(dom, String(vnode.nodeName))) {\n            out = createNode(String(vnode.nodeName), isSvgMode);\n            if (dom) {\n                while (dom.firstChild) out.appendChild(dom.firstChild);\n                if (dom.parentNode) dom.parentNode.replaceChild(out, dom);\n                recollectNodeTree(dom, !0);\n            }\n        }\n        var fc = out.firstChild, props = out.__preactattr_ || (out.__preactattr_ = {}), vchildren = vnode.children;\n        if (!hydrating && vchildren && 1 === vchildren.length && 'string' == typeof vchildren[0] && null != fc && void 0 !== fc.splitText && null == fc.nextSibling) {\n            if (fc.nodeValue != vchildren[0]) fc.nodeValue = vchildren[0];\n        } else if (vchildren && vchildren.length || null != fc) innerDiffNode(out, vchildren, context, mountAll, hydrating || null != props.dangerouslySetInnerHTML);\n        diffAttributes(out, vnode.attributes, props);\n        isSvgMode = prevSvgMode;\n        return out;\n    }\n    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {\n        var j, c, vchild, child, originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0;\n        if (0 !== len) for (var i = 0; i < len; i++) {\n            var _child = originalChildren[i], props = _child.__preactattr_, key = vlen && props ? _child._component ? _child._component.__k : props.key : null;\n            if (null != key) {\n                keyedLen++;\n                keyed[key] = _child;\n            } else if (props || (void 0 !== _child.splitText ? isHydrating ? _child.nodeValue.trim() : !0 : isHydrating)) children[childrenLen++] = _child;\n        }\n        if (0 !== vlen) for (var i = 0; i < vlen; i++) {\n            vchild = vchildren[i];\n            child = null;\n            var key = vchild.key;\n            if (null != key) {\n                if (keyedLen && void 0 !== keyed[key]) {\n                    child = keyed[key];\n                    keyed[key] = void 0;\n                    keyedLen--;\n                }\n            } else if (!child && min < childrenLen) for (j = min; j < childrenLen; j++) if (void 0 !== children[j] && isSameNodeType(c = children[j], vchild, isHydrating)) {\n                child = c;\n                children[j] = void 0;\n                if (j === childrenLen - 1) childrenLen--;\n                if (j === min) min++;\n                break;\n            }\n            child = idiff(child, vchild, context, mountAll);\n            if (child && child !== dom) if (i >= len) dom.appendChild(child); else if (child !== originalChildren[i]) if (child === originalChildren[i + 1]) removeNode(originalChildren[i]); else dom.insertBefore(child, originalChildren[i] || null);\n        }\n        if (keyedLen) for (var i in keyed) if (void 0 !== keyed[i]) recollectNodeTree(keyed[i], !1);\n        while (min <= childrenLen) if (void 0 !== (child = children[childrenLen--])) recollectNodeTree(child, !1);\n    }\n    function recollectNodeTree(node, unmountOnly) {\n        var component = node._component;\n        if (component) unmountComponent(component); else {\n            if (null != node.__preactattr_ && node.__preactattr_.ref) node.__preactattr_.ref(null);\n            if (unmountOnly === !1 || null == node.__preactattr_) removeNode(node);\n            removeChildren(node);\n        }\n    }\n    function removeChildren(node) {\n        node = node.lastChild;\n        while (node) {\n            var next = node.previousSibling;\n            recollectNodeTree(node, !0);\n            node = next;\n        }\n    }\n    function diffAttributes(dom, attrs, old) {\n        var name;\n        for (name in old) if ((!attrs || null == attrs[name]) && null != old[name]) setAccessor(dom, name, old[name], old[name] = void 0, isSvgMode);\n        for (name in attrs) if (!('children' === name || 'innerHTML' === name || name in old && attrs[name] === ('value' === name || 'checked' === name ? dom[name] : old[name]))) setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);\n    }\n    function collectComponent(component) {\n        var name = component.constructor.name;\n        (components[name] || (components[name] = [])).push(component);\n    }\n    function createComponent(Ctor, props, context) {\n        var inst, list = components[Ctor.name];\n        if (Ctor.prototype && Ctor.prototype.render) {\n            inst = new Ctor(props, context);\n            Component.call(inst, props, context);\n        } else {\n            inst = new Component(props, context);\n            inst.constructor = Ctor;\n            inst.render = doRender;\n        }\n        if (list) for (var i = list.length; i--; ) if (list[i].constructor === Ctor) {\n            inst.__b = list[i].__b;\n            list.splice(i, 1);\n            break;\n        }\n        return inst;\n    }\n    function doRender(props, state, context) {\n        return this.constructor(props, context);\n    }\n    function setComponentProps(component, props, opts, context, mountAll) {\n        if (!component.__x) {\n            component.__x = !0;\n            if (component.__r = props.ref) delete props.ref;\n            if (component.__k = props.key) delete props.key;\n            if (!component.base || mountAll) {\n                if (component.componentWillMount) component.componentWillMount();\n            } else if (component.componentWillReceiveProps) component.componentWillReceiveProps(props, context);\n            if (context && context !== component.context) {\n                if (!component.__c) component.__c = component.context;\n                component.context = context;\n            }\n            if (!component.__p) component.__p = component.props;\n            component.props = props;\n            component.__x = !1;\n            if (0 !== opts) if (1 === opts || options.syncComponentUpdates !== !1 || !component.base) renderComponent(component, 1, mountAll); else enqueueRender(component);\n            if (component.__r) component.__r(component);\n        }\n    }\n    function renderComponent(component, opts, mountAll, isChild) {\n        if (!component.__x) {\n            var rendered, inst, cbase, props = component.props, state = component.state, context = component.context, previousProps = component.__p || props, previousState = component.__s || state, previousContext = component.__c || context, isUpdate = component.base, nextBase = component.__b, initialBase = isUpdate || nextBase, initialChildComponent = component._component, skip = !1;\n            if (isUpdate) {\n                component.props = previousProps;\n                component.state = previousState;\n                component.context = previousContext;\n                if (2 !== opts && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === !1) skip = !0; else if (component.componentWillUpdate) component.componentWillUpdate(props, state, context);\n                component.props = props;\n                component.state = state;\n                component.context = context;\n            }\n            component.__p = component.__s = component.__c = component.__b = null;\n            component.__d = !1;\n            if (!skip) {\n                rendered = component.render(props, state, context);\n                if (component.getChildContext) context = extend(extend({}, context), component.getChildContext());\n                var toUnmount, base, childComponent = rendered && rendered.nodeName;\n                if ('function' == typeof childComponent) {\n                    var childProps = getNodeProps(rendered);\n                    inst = initialChildComponent;\n                    if (inst && inst.constructor === childComponent && childProps.key == inst.__k) setComponentProps(inst, childProps, 1, context, !1); else {\n                        toUnmount = inst;\n                        component._component = inst = createComponent(childComponent, childProps, context);\n                        inst.__b = inst.__b || nextBase;\n                        inst.__u = component;\n                        setComponentProps(inst, childProps, 0, context, !1);\n                        renderComponent(inst, 1, mountAll, !0);\n                    }\n                    base = inst.base;\n                } else {\n                    cbase = initialBase;\n                    toUnmount = initialChildComponent;\n                    if (toUnmount) cbase = component._component = null;\n                    if (initialBase || 1 === opts) {\n                        if (cbase) cbase._component = null;\n                        base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, !0);\n                    }\n                }\n                if (initialBase && base !== initialBase && inst !== initialChildComponent) {\n                    var baseParent = initialBase.parentNode;\n                    if (baseParent && base !== baseParent) {\n                        baseParent.replaceChild(base, initialBase);\n                        if (!toUnmount) {\n                            initialBase._component = null;\n                            recollectNodeTree(initialBase, !1);\n                        }\n                    }\n                }\n                if (toUnmount) unmountComponent(toUnmount);\n                component.base = base;\n                if (base && !isChild) {\n                    var componentRef = component, t = component;\n                    while (t = t.__u) (componentRef = t).base = base;\n                    base._component = componentRef;\n                    base._componentConstructor = componentRef.constructor;\n                }\n            }\n            if (!isUpdate || mountAll) mounts.unshift(component); else if (!skip) {\n                flushMounts();\n                if (component.componentDidUpdate) component.componentDidUpdate(previousProps, previousState, previousContext);\n                if (options.afterUpdate) options.afterUpdate(component);\n            }\n            if (null != component.__h) while (component.__h.length) component.__h.pop().call(component);\n            if (!diffLevel && !isChild) flushMounts();\n        }\n    }\n    function buildComponentFromVNode(dom, vnode, context, mountAll) {\n        var c = dom && dom._component, originalComponent = c, oldDom = dom, isDirectOwner = c && dom._componentConstructor === vnode.nodeName, isOwner = isDirectOwner, props = getNodeProps(vnode);\n        while (c && !isOwner && (c = c.__u)) isOwner = c.constructor === vnode.nodeName;\n        if (c && isOwner && (!mountAll || c._component)) {\n            setComponentProps(c, props, 3, context, mountAll);\n            dom = c.base;\n        } else {\n            if (originalComponent && !isDirectOwner) {\n                unmountComponent(originalComponent);\n                dom = oldDom = null;\n            }\n            c = createComponent(vnode.nodeName, props, context);\n            if (dom && !c.__b) {\n                c.__b = dom;\n                oldDom = null;\n            }\n            setComponentProps(c, props, 1, context, mountAll);\n            dom = c.base;\n            if (oldDom && dom !== oldDom) {\n                oldDom._component = null;\n                recollectNodeTree(oldDom, !1);\n            }\n        }\n        return dom;\n    }\n    function unmountComponent(component) {\n        if (options.beforeUnmount) options.beforeUnmount(component);\n        var base = component.base;\n        component.__x = !0;\n        if (component.componentWillUnmount) component.componentWillUnmount();\n        component.base = null;\n        var inner = component._component;\n        if (inner) unmountComponent(inner); else if (base) {\n            if (base.__preactattr_ && base.__preactattr_.ref) base.__preactattr_.ref(null);\n            component.__b = base;\n            removeNode(base);\n            collectComponent(component);\n            removeChildren(base);\n        }\n        if (component.__r) component.__r(null);\n    }\n    function Component(props, context) {\n        this.__d = !0;\n        this.context = context;\n        this.props = props;\n        this.state = this.state || {};\n    }\n    function render(vnode, parent, merge) {\n        return diff(merge, vnode, {}, !1, parent, !1);\n    }\n    var options = {};\n    var stack = [];\n    var EMPTY_CHILDREN = [];\n    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;\n    var items = [];\n    var mounts = [];\n    var diffLevel = 0;\n    var isSvgMode = !1;\n    var hydrating = !1;\n    var components = {};\n    extend(Component.prototype, {\n        setState: function(state, callback) {\n            var s = this.state;\n            if (!this.__s) this.__s = extend({}, s);\n            extend(s, 'function' == typeof state ? state(s, this.props) : state);\n            if (callback) (this.__h = this.__h || []).push(callback);\n            enqueueRender(this);\n        },\n        forceUpdate: function(callback) {\n            if (callback) (this.__h = this.__h || []).push(callback);\n            renderComponent(this, 2);\n        },\n        render: function() {}\n    });\n    var preact = {\n        h: h,\n        createElement: h,\n        cloneElement: cloneElement,\n        Component: Component,\n        render: render,\n        rerender: rerender,\n        options: options\n    };\n    if (true) module.exports = preact; else self.preact = preact;\n}();\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMC5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy8uLi9zcmMvdm5vZGUuanM/MGYzOSIsIndlYnBhY2s6Ly8vLi4vc3JjL2guanM/N2I2YyIsIndlYnBhY2s6Ly8vLi4vc3JjL3V0aWwuanM/ZDRlYiIsIndlYnBhY2s6Ly8vLi4vc3JjL2Nsb25lLWVsZW1lbnQuanM/Y2FlOSIsIndlYnBhY2s6Ly8vLi4vc3JjL2NvbnN0YW50cy5qcz84MDI4Iiwid2VicGFjazovLy8uLi9zcmMvcmVuZGVyLXF1ZXVlLmpzP2Y3YTIiLCJ3ZWJwYWNrOi8vLy4uL3NyYy92ZG9tL2luZGV4LmpzP2RjNGYiLCJ3ZWJwYWNrOi8vLy4uL3NyYy9kb20vaW5kZXguanM/Njg3MiIsIndlYnBhY2s6Ly8vLi4vc3JjL3Zkb20vZGlmZi5qcz9kOTY2Iiwid2VicGFjazovLy8uLi9zcmMvdmRvbS9jb21wb25lbnQtcmVjeWNsZXIuanM/ZDA3MCIsIndlYnBhY2s6Ly8vLi4vc3JjL3Zkb20vY29tcG9uZW50LmpzPzRhZGYiLCJ3ZWJwYWNrOi8vLy4uL3NyYy9vcHRpb25zLmpzPzkzZDAiLCJ3ZWJwYWNrOi8vLy4uL3NyYy9jb21wb25lbnQuanM/ZjcwOCIsIndlYnBhY2s6Ly8vLi4vc3JjL3JlbmRlci5qcz8yYWY0Iiwid2VicGFjazovLy8uLi9zcmMvcHJlYWN0LmpzPzEyMmIiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqIFZpcnR1YWwgRE9NIE5vZGUgKi9cbmV4cG9ydCBmdW5jdGlvbiBWTm9kZSgpIHt9XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3Zub2RlLmpzIiwiaW1wb3J0IHsgVk5vZGUgfSBmcm9tICcuL3Zub2RlJztcbmltcG9ydCBvcHRpb25zIGZyb20gJy4vb3B0aW9ucyc7XG5cblxuY29uc3Qgc3RhY2sgPSBbXTtcblxuY29uc3QgRU1QVFlfQ0hJTERSRU4gPSBbXTtcblxuLyoqIEpTWC9oeXBlcnNjcmlwdCByZXZpdmVyXG4qXHRCZW5jaG1hcmtzOiBodHRwczovL2VzYmVuY2guY29tL2JlbmNoLzU3ZWU4ZjhlMzMwYWIwOTkwMGExYTFhMFxuICpcdEBzZWUgaHR0cDovL2phc29uZm9ybWF0LmNvbS93dGYtaXMtanN4XG4gKlx0QHB1YmxpY1xuICovXG5leHBvcnQgZnVuY3Rpb24gaChub2RlTmFtZSwgYXR0cmlidXRlcykge1xuXHRsZXQgY2hpbGRyZW49RU1QVFlfQ0hJTERSRU4sIGxhc3RTaW1wbGUsIGNoaWxkLCBzaW1wbGUsIGk7XG5cdGZvciAoaT1hcmd1bWVudHMubGVuZ3RoOyBpLS0gPiAyOyApIHtcblx0XHRzdGFjay5wdXNoKGFyZ3VtZW50c1tpXSk7XG5cdH1cblx0aWYgKGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy5jaGlsZHJlbiE9bnVsbCkge1xuXHRcdGlmICghc3RhY2subGVuZ3RoKSBzdGFjay5wdXNoKGF0dHJpYnV0ZXMuY2hpbGRyZW4pO1xuXHRcdGRlbGV0ZSBhdHRyaWJ1dGVzLmNoaWxkcmVuO1xuXHR9XG5cdHdoaWxlIChzdGFjay5sZW5ndGgpIHtcblx0XHRpZiAoKGNoaWxkID0gc3RhY2sucG9wKCkpICYmIGNoaWxkLnBvcCE9PXVuZGVmaW5lZCkge1xuXHRcdFx0Zm9yIChpPWNoaWxkLmxlbmd0aDsgaS0tOyApIHN0YWNrLnB1c2goY2hpbGRbaV0pO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGlmIChjaGlsZD09PXRydWUgfHwgY2hpbGQ9PT1mYWxzZSkgY2hpbGQgPSBudWxsO1xuXG5cdFx0XHRpZiAoKHNpbXBsZSA9IHR5cGVvZiBub2RlTmFtZSE9PSdmdW5jdGlvbicpKSB7XG5cdFx0XHRcdGlmIChjaGlsZD09bnVsbCkgY2hpbGQgPSAnJztcblx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGNoaWxkPT09J251bWJlcicpIGNoaWxkID0gU3RyaW5nKGNoaWxkKTtcblx0XHRcdFx0ZWxzZSBpZiAodHlwZW9mIGNoaWxkIT09J3N0cmluZycpIHNpbXBsZSA9IGZhbHNlO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoc2ltcGxlICYmIGxhc3RTaW1wbGUpIHtcblx0XHRcdFx0Y2hpbGRyZW5bY2hpbGRyZW4ubGVuZ3RoLTFdICs9IGNoaWxkO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoY2hpbGRyZW49PT1FTVBUWV9DSElMRFJFTikge1xuXHRcdFx0XHRjaGlsZHJlbiA9IFtjaGlsZF07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y2hpbGRyZW4ucHVzaChjaGlsZCk7XG5cdFx0XHR9XG5cblx0XHRcdGxhc3RTaW1wbGUgPSBzaW1wbGU7XG5cdFx0fVxuXHR9XG5cblx0bGV0IHAgPSBuZXcgVk5vZGUoKTtcblx0cC5ub2RlTmFtZSA9IG5vZGVOYW1lO1xuXHRwLmNoaWxkcmVuID0gY2hpbGRyZW47XG5cdHAuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM9PW51bGwgPyB1bmRlZmluZWQgOiBhdHRyaWJ1dGVzO1xuXHRwLmtleSA9IGF0dHJpYnV0ZXM9PW51bGwgPyB1bmRlZmluZWQgOiBhdHRyaWJ1dGVzLmtleTtcblxuXHQvLyBpZiBhIFwidm5vZGUgaG9va1wiIGlzIGRlZmluZWQsIHBhc3MgZXZlcnkgY3JlYXRlZCBWTm9kZSB0byBpdFxuXHRpZiAob3B0aW9ucy52bm9kZSE9PXVuZGVmaW5lZCkgb3B0aW9ucy52bm9kZShwKTtcblxuXHRyZXR1cm4gcDtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvaC5qcyIsIi8qKiBDb3B5IG93bi1wcm9wZXJ0aWVzIGZyb20gYHByb3BzYCBvbnRvIGBvYmpgLlxuICpcdEByZXR1cm5zIG9ialxuICpcdEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleHRlbmQob2JqLCBwcm9wcykge1xuXHRmb3IgKGxldCBpIGluIHByb3BzKSBvYmpbaV0gPSBwcm9wc1tpXTtcblx0cmV0dXJuIG9iajtcbn1cblxuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3V0aWwuanMiLCJpbXBvcnQgeyBleHRlbmQgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgaCB9IGZyb20gJy4vaCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9uZUVsZW1lbnQodm5vZGUsIHByb3BzKSB7XG5cdHJldHVybiBoKFxuXHRcdHZub2RlLm5vZGVOYW1lLFxuXHRcdGV4dGVuZChleHRlbmQoe30sIHZub2RlLmF0dHJpYnV0ZXMpLCBwcm9wcyksXG5cdFx0YXJndW1lbnRzLmxlbmd0aD4yID8gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogdm5vZGUuY2hpbGRyZW5cblx0KTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvY2xvbmUtZWxlbWVudC5qcyIsIi8vIHJlbmRlciBtb2Rlc1xuXG5leHBvcnQgY29uc3QgTk9fUkVOREVSID0gMDtcbmV4cG9ydCBjb25zdCBTWU5DX1JFTkRFUiA9IDE7XG5leHBvcnQgY29uc3QgRk9SQ0VfUkVOREVSID0gMjtcbmV4cG9ydCBjb25zdCBBU1lOQ19SRU5ERVIgPSAzO1xuXG5cbmV4cG9ydCBjb25zdCBBVFRSX0tFWSA9ICdfX3ByZWFjdGF0dHJfJztcblxuLy8gRE9NIHByb3BlcnRpZXMgdGhhdCBzaG91bGQgTk9UIGhhdmUgXCJweFwiIGFkZGVkIHdoZW4gbnVtZXJpY1xuZXhwb3J0IGNvbnN0IElTX05PTl9ESU1FTlNJT05BTCA9IC9hY2l0fGV4KD86c3xnfG58cHwkKXxycGh8b3dzfG1uY3xudHd8aW5lW2NoXXx6b298Xm9yZC9pO1xuXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL2NvbnN0YW50cy5qcyIsImltcG9ydCBvcHRpb25zIGZyb20gJy4vb3B0aW9ucyc7XG5pbXBvcnQgeyByZW5kZXJDb21wb25lbnQgfSBmcm9tICcuL3Zkb20vY29tcG9uZW50JztcblxuLyoqIE1hbmFnZWQgcXVldWUgb2YgZGlydHkgY29tcG9uZW50cyB0byBiZSByZS1yZW5kZXJlZCAqL1xuXG5sZXQgaXRlbXMgPSBbXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVucXVldWVSZW5kZXIoY29tcG9uZW50KSB7XG5cdGlmICghY29tcG9uZW50Ll9kaXJ0eSAmJiAoY29tcG9uZW50Ll9kaXJ0eSA9IHRydWUpICYmIGl0ZW1zLnB1c2goY29tcG9uZW50KT09MSkge1xuXHRcdChvcHRpb25zLmRlYm91bmNlUmVuZGVyaW5nIHx8IHNldFRpbWVvdXQpKHJlcmVuZGVyKTtcblx0fVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiByZXJlbmRlcigpIHtcblx0bGV0IHAsIGxpc3QgPSBpdGVtcztcblx0aXRlbXMgPSBbXTtcblx0d2hpbGUgKCAocCA9IGxpc3QucG9wKCkpICkge1xuXHRcdGlmIChwLl9kaXJ0eSkgcmVuZGVyQ29tcG9uZW50KHApO1xuXHR9XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3JlbmRlci1xdWV1ZS5qcyIsImltcG9ydCB7IGV4dGVuZCB9IGZyb20gJy4uL3V0aWwnO1xuXG5cbi8qKiBDaGVjayBpZiB0d28gbm9kZXMgYXJlIGVxdWl2YWxlbnQuXG4gKlx0QHBhcmFtIHtFbGVtZW50fSBub2RlXG4gKlx0QHBhcmFtIHtWTm9kZX0gdm5vZGVcbiAqXHRAcHJpdmF0ZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNTYW1lTm9kZVR5cGUobm9kZSwgdm5vZGUsIGh5ZHJhdGluZykge1xuXHRpZiAodHlwZW9mIHZub2RlPT09J3N0cmluZycgfHwgdHlwZW9mIHZub2RlPT09J251bWJlcicpIHtcblx0XHRyZXR1cm4gbm9kZS5zcGxpdFRleHQhPT11bmRlZmluZWQ7XG5cdH1cblx0aWYgKHR5cGVvZiB2bm9kZS5ub2RlTmFtZT09PSdzdHJpbmcnKSB7XG5cdFx0cmV0dXJuICFub2RlLl9jb21wb25lbnRDb25zdHJ1Y3RvciAmJiBpc05hbWVkTm9kZShub2RlLCB2bm9kZS5ub2RlTmFtZSk7XG5cdH1cblx0cmV0dXJuIGh5ZHJhdGluZyB8fCBub2RlLl9jb21wb25lbnRDb25zdHJ1Y3Rvcj09PXZub2RlLm5vZGVOYW1lO1xufVxuXG5cbi8qKiBDaGVjayBpZiBhbiBFbGVtZW50IGhhcyBhIGdpdmVuIG5vcm1hbGl6ZWQgbmFtZS5cbipcdEBwYXJhbSB7RWxlbWVudH0gbm9kZVxuKlx0QHBhcmFtIHtTdHJpbmd9IG5vZGVOYW1lXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc05hbWVkTm9kZShub2RlLCBub2RlTmFtZSkge1xuXHRyZXR1cm4gbm9kZS5ub3JtYWxpemVkTm9kZU5hbWU9PT1ub2RlTmFtZSB8fCBub2RlLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk9PT1ub2RlTmFtZS50b0xvd2VyQ2FzZSgpO1xufVxuXG5cbi8qKlxuICogUmVjb25zdHJ1Y3QgQ29tcG9uZW50LXN0eWxlIGBwcm9wc2AgZnJvbSBhIFZOb2RlLlxuICogRW5zdXJlcyBkZWZhdWx0L2ZhbGxiYWNrIHZhbHVlcyBmcm9tIGBkZWZhdWx0UHJvcHNgOlxuICogT3duLXByb3BlcnRpZXMgb2YgYGRlZmF1bHRQcm9wc2Agbm90IHByZXNlbnQgaW4gYHZub2RlLmF0dHJpYnV0ZXNgIGFyZSBhZGRlZC5cbiAqIEBwYXJhbSB7Vk5vZGV9IHZub2RlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBwcm9wc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0Tm9kZVByb3BzKHZub2RlKSB7XG5cdGxldCBwcm9wcyA9IGV4dGVuZCh7fSwgdm5vZGUuYXR0cmlidXRlcyk7XG5cdHByb3BzLmNoaWxkcmVuID0gdm5vZGUuY2hpbGRyZW47XG5cblx0bGV0IGRlZmF1bHRQcm9wcyA9IHZub2RlLm5vZGVOYW1lLmRlZmF1bHRQcm9wcztcblx0aWYgKGRlZmF1bHRQcm9wcyE9PXVuZGVmaW5lZCkge1xuXHRcdGZvciAobGV0IGkgaW4gZGVmYXVsdFByb3BzKSB7XG5cdFx0XHRpZiAocHJvcHNbaV09PT11bmRlZmluZWQpIHtcblx0XHRcdFx0cHJvcHNbaV0gPSBkZWZhdWx0UHJvcHNbaV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHByb3BzO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy92ZG9tL2luZGV4LmpzIiwiaW1wb3J0IHsgSVNfTk9OX0RJTUVOU0lPTkFMIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCBvcHRpb25zIGZyb20gJy4uL29wdGlvbnMnO1xuXG5cbi8qKiBDcmVhdGUgYW4gZWxlbWVudCB3aXRoIHRoZSBnaXZlbiBub2RlTmFtZS5cbiAqXHRAcGFyYW0ge1N0cmluZ30gbm9kZU5hbWVcbiAqXHRAcGFyYW0ge0Jvb2xlYW59IFtpc1N2Zz1mYWxzZV1cdElmIGB0cnVlYCwgY3JlYXRlcyBhbiBlbGVtZW50IHdpdGhpbiB0aGUgU1ZHIG5hbWVzcGFjZS5cbiAqXHRAcmV0dXJucyB7RWxlbWVudH0gbm9kZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTm9kZShub2RlTmFtZSwgaXNTdmcpIHtcblx0bGV0IG5vZGUgPSBpc1N2ZyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUygnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnLCBub2RlTmFtZSkgOiBkb2N1bWVudC5jcmVhdGVFbGVtZW50KG5vZGVOYW1lKTtcblx0bm9kZS5ub3JtYWxpemVkTm9kZU5hbWUgPSBub2RlTmFtZTtcblx0cmV0dXJuIG5vZGU7XG59XG5cblxuLyoqIFJlbW92ZSBhIGNoaWxkIG5vZGUgZnJvbSBpdHMgcGFyZW50IGlmIGF0dGFjaGVkLlxuICpcdEBwYXJhbSB7RWxlbWVudH0gbm9kZVx0XHRUaGUgbm9kZSB0byByZW1vdmVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZU5vZGUobm9kZSkge1xuXHRpZiAobm9kZS5wYXJlbnROb2RlKSBub2RlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobm9kZSk7XG59XG5cblxuLyoqIFNldCBhIG5hbWVkIGF0dHJpYnV0ZSBvbiB0aGUgZ2l2ZW4gTm9kZSwgd2l0aCBzcGVjaWFsIGJlaGF2aW9yIGZvciBzb21lIG5hbWVzIGFuZCBldmVudCBoYW5kbGVycy5cbiAqXHRJZiBgdmFsdWVgIGlzIGBudWxsYCwgdGhlIGF0dHJpYnV0ZS9oYW5kbGVyIHdpbGwgYmUgcmVtb3ZlZC5cbiAqXHRAcGFyYW0ge0VsZW1lbnR9IG5vZGVcdEFuIGVsZW1lbnQgdG8gbXV0YXRlXG4gKlx0QHBhcmFtIHtzdHJpbmd9IG5hbWVcdFRoZSBuYW1lL2tleSB0byBzZXQsIHN1Y2ggYXMgYW4gZXZlbnQgb3IgYXR0cmlidXRlIG5hbWVcbiAqXHRAcGFyYW0ge2FueX0gb2xkXHRUaGUgbGFzdCB2YWx1ZSB0aGF0IHdhcyBzZXQgZm9yIHRoaXMgbmFtZS9ub2RlIHBhaXJcbiAqXHRAcGFyYW0ge2FueX0gdmFsdWVcdEFuIGF0dHJpYnV0ZSB2YWx1ZSwgc3VjaCBhcyBhIGZ1bmN0aW9uIHRvIGJlIHVzZWQgYXMgYW4gZXZlbnQgaGFuZGxlclxuICpcdEBwYXJhbSB7Qm9vbGVhbn0gaXNTdmdcdEFyZSB3ZSBjdXJyZW50bHkgZGlmZmluZyBpbnNpZGUgYW4gc3ZnP1xuICpcdEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzZXRBY2Nlc3Nvcihub2RlLCBuYW1lLCBvbGQsIHZhbHVlLCBpc1N2Zykge1xuXHRpZiAobmFtZT09PSdjbGFzc05hbWUnKSBuYW1lID0gJ2NsYXNzJztcblxuXG5cdGlmIChuYW1lPT09J2tleScpIHtcblx0XHQvLyBpZ25vcmVcblx0fVxuXHRlbHNlIGlmIChuYW1lPT09J3JlZicpIHtcblx0XHRpZiAob2xkKSBvbGQobnVsbCk7XG5cdFx0aWYgKHZhbHVlKSB2YWx1ZShub2RlKTtcblx0fVxuXHRlbHNlIGlmIChuYW1lPT09J2NsYXNzJyAmJiAhaXNTdmcpIHtcblx0XHRub2RlLmNsYXNzTmFtZSA9IHZhbHVlIHx8ICcnO1xuXHR9XG5cdGVsc2UgaWYgKG5hbWU9PT0nc3R5bGUnKSB7XG5cdFx0aWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWU9PT0nc3RyaW5nJyB8fCB0eXBlb2Ygb2xkPT09J3N0cmluZycpIHtcblx0XHRcdG5vZGUuc3R5bGUuY3NzVGV4dCA9IHZhbHVlIHx8ICcnO1xuXHRcdH1cblx0XHRpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlPT09J29iamVjdCcpIHtcblx0XHRcdGlmICh0eXBlb2Ygb2xkIT09J3N0cmluZycpIHtcblx0XHRcdFx0Zm9yIChsZXQgaSBpbiBvbGQpIGlmICghKGkgaW4gdmFsdWUpKSBub2RlLnN0eWxlW2ldID0gJyc7XG5cdFx0XHR9XG5cdFx0XHRmb3IgKGxldCBpIGluIHZhbHVlKSB7XG5cdFx0XHRcdG5vZGUuc3R5bGVbaV0gPSB0eXBlb2YgdmFsdWVbaV09PT0nbnVtYmVyJyAmJiBJU19OT05fRElNRU5TSU9OQUwudGVzdChpKT09PWZhbHNlID8gKHZhbHVlW2ldKydweCcpIDogdmFsdWVbaV07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGVsc2UgaWYgKG5hbWU9PT0nZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwnKSB7XG5cdFx0aWYgKHZhbHVlKSBub2RlLmlubmVySFRNTCA9IHZhbHVlLl9faHRtbCB8fCAnJztcblx0fVxuXHRlbHNlIGlmIChuYW1lWzBdPT0nbycgJiYgbmFtZVsxXT09J24nKSB7XG5cdFx0bGV0IHVzZUNhcHR1cmUgPSBuYW1lICE9PSAobmFtZT1uYW1lLnJlcGxhY2UoL0NhcHR1cmUkLywgJycpKTtcblx0XHRuYW1lID0gbmFtZS50b0xvd2VyQ2FzZSgpLnN1YnN0cmluZygyKTtcblx0XHRpZiAodmFsdWUpIHtcblx0XHRcdGlmICghb2xkKSBub2RlLmFkZEV2ZW50TGlzdGVuZXIobmFtZSwgZXZlbnRQcm94eSwgdXNlQ2FwdHVyZSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0bm9kZS5yZW1vdmVFdmVudExpc3RlbmVyKG5hbWUsIGV2ZW50UHJveHksIHVzZUNhcHR1cmUpO1xuXHRcdH1cblx0XHQobm9kZS5fbGlzdGVuZXJzIHx8IChub2RlLl9saXN0ZW5lcnMgPSB7fSkpW25hbWVdID0gdmFsdWU7XG5cdH1cblx0ZWxzZSBpZiAobmFtZSE9PSdsaXN0JyAmJiBuYW1lIT09J3R5cGUnICYmICFpc1N2ZyAmJiBuYW1lIGluIG5vZGUpIHtcblx0XHRzZXRQcm9wZXJ0eShub2RlLCBuYW1lLCB2YWx1ZT09bnVsbCA/ICcnIDogdmFsdWUpO1xuXHRcdGlmICh2YWx1ZT09bnVsbCB8fCB2YWx1ZT09PWZhbHNlKSBub2RlLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcblx0fVxuXHRlbHNlIHtcblx0XHRsZXQgbnMgPSBpc1N2ZyAmJiAobmFtZSAhPT0gKG5hbWUgPSBuYW1lLnJlcGxhY2UoL154bGlua1xcOj8vLCAnJykpKTtcblx0XHRpZiAodmFsdWU9PW51bGwgfHwgdmFsdWU9PT1mYWxzZSkge1xuXHRcdFx0aWYgKG5zKSBub2RlLnJlbW92ZUF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgbmFtZS50b0xvd2VyQ2FzZSgpKTtcblx0XHRcdGVsc2Ugbm9kZS5yZW1vdmVBdHRyaWJ1dGUobmFtZSk7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSE9PSdmdW5jdGlvbicpIHtcblx0XHRcdGlmIChucykgbm9kZS5zZXRBdHRyaWJ1dGVOUygnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaycsIG5hbWUudG9Mb3dlckNhc2UoKSwgdmFsdWUpO1xuXHRcdFx0ZWxzZSBub2RlLnNldEF0dHJpYnV0ZShuYW1lLCB2YWx1ZSk7XG5cdFx0fVxuXHR9XG59XG5cblxuLyoqIEF0dGVtcHQgdG8gc2V0IGEgRE9NIHByb3BlcnR5IHRvIHRoZSBnaXZlbiB2YWx1ZS5cbiAqXHRJRSAmIEZGIHRocm93IGZvciBjZXJ0YWluIHByb3BlcnR5LXZhbHVlIGNvbWJpbmF0aW9ucy5cbiAqL1xuZnVuY3Rpb24gc2V0UHJvcGVydHkobm9kZSwgbmFtZSwgdmFsdWUpIHtcblx0dHJ5IHtcblx0XHRub2RlW25hbWVdID0gdmFsdWU7XG5cdH0gY2F0Y2ggKGUpIHsgfVxufVxuXG5cbi8qKiBQcm94eSBhbiBldmVudCB0byBob29rZWQgZXZlbnQgaGFuZGxlcnNcbiAqXHRAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBldmVudFByb3h5KGUpIHtcblx0cmV0dXJuIHRoaXMuX2xpc3RlbmVyc1tlLnR5cGVdKG9wdGlvbnMuZXZlbnQgJiYgb3B0aW9ucy5ldmVudChlKSB8fCBlKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvZG9tL2luZGV4LmpzIiwiaW1wb3J0IHsgQVRUUl9LRVkgfSBmcm9tICcuLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgaXNTYW1lTm9kZVR5cGUsIGlzTmFtZWROb2RlIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgeyBidWlsZENvbXBvbmVudEZyb21WTm9kZSB9IGZyb20gJy4vY29tcG9uZW50JztcbmltcG9ydCB7IGNyZWF0ZU5vZGUsIHNldEFjY2Vzc29yIH0gZnJvbSAnLi4vZG9tL2luZGV4JztcbmltcG9ydCB7IHVubW91bnRDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudCc7XG5pbXBvcnQgb3B0aW9ucyBmcm9tICcuLi9vcHRpb25zJztcbmltcG9ydCB7IHJlbW92ZU5vZGUgfSBmcm9tICcuLi9kb20nO1xuXG4vKiogUXVldWUgb2YgY29tcG9uZW50cyB0aGF0IGhhdmUgYmVlbiBtb3VudGVkIGFuZCBhcmUgYXdhaXRpbmcgY29tcG9uZW50RGlkTW91bnQgKi9cbmV4cG9ydCBjb25zdCBtb3VudHMgPSBbXTtcblxuLyoqIERpZmYgcmVjdXJzaW9uIGNvdW50LCB1c2VkIHRvIHRyYWNrIHRoZSBlbmQgb2YgdGhlIGRpZmYgY3ljbGUuICovXG5leHBvcnQgbGV0IGRpZmZMZXZlbCA9IDA7XG5cbi8qKiBHbG9iYWwgZmxhZyBpbmRpY2F0aW5nIGlmIHRoZSBkaWZmIGlzIGN1cnJlbnRseSB3aXRoaW4gYW4gU1ZHICovXG5sZXQgaXNTdmdNb2RlID0gZmFsc2U7XG5cbi8qKiBHbG9iYWwgZmxhZyBpbmRpY2F0aW5nIGlmIHRoZSBkaWZmIGlzIHBlcmZvcm1pbmcgaHlkcmF0aW9uICovXG5sZXQgaHlkcmF0aW5nID0gZmFsc2U7XG5cbi8qKiBJbnZva2UgcXVldWVkIGNvbXBvbmVudERpZE1vdW50IGxpZmVjeWNsZSBtZXRob2RzICovXG5leHBvcnQgZnVuY3Rpb24gZmx1c2hNb3VudHMoKSB7XG5cdGxldCBjO1xuXHR3aGlsZSAoKGM9bW91bnRzLnBvcCgpKSkge1xuXHRcdGlmIChvcHRpb25zLmFmdGVyTW91bnQpIG9wdGlvbnMuYWZ0ZXJNb3VudChjKTtcblx0XHRpZiAoYy5jb21wb25lbnREaWRNb3VudCkgYy5jb21wb25lbnREaWRNb3VudCgpO1xuXHR9XG59XG5cblxuLyoqIEFwcGx5IGRpZmZlcmVuY2VzIGluIGEgZ2l2ZW4gdm5vZGUgKGFuZCBpdCdzIGRlZXAgY2hpbGRyZW4pIHRvIGEgcmVhbCBET00gTm9kZS5cbiAqXHRAcGFyYW0ge0VsZW1lbnR9IFtkb209bnVsbF1cdFx0QSBET00gbm9kZSB0byBtdXRhdGUgaW50byB0aGUgc2hhcGUgb2YgdGhlIGB2bm9kZWBcbiAqXHRAcGFyYW0ge1ZOb2RlfSB2bm9kZVx0XHRcdEEgVk5vZGUgKHdpdGggZGVzY2VuZGFudHMgZm9ybWluZyBhIHRyZWUpIHJlcHJlc2VudGluZyB0aGUgZGVzaXJlZCBET00gc3RydWN0dXJlXG4gKlx0QHJldHVybnMge0VsZW1lbnR9IGRvbVx0XHRcdFRoZSBjcmVhdGVkL211dGF0ZWQgZWxlbWVudFxuICpcdEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaWZmKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsLCBwYXJlbnQsIGNvbXBvbmVudFJvb3QpIHtcblx0Ly8gZGlmZkxldmVsIGhhdmluZyBiZWVuIDAgaGVyZSBpbmRpY2F0ZXMgaW5pdGlhbCBlbnRyeSBpbnRvIHRoZSBkaWZmIChub3QgYSBzdWJkaWZmKVxuXHRpZiAoIWRpZmZMZXZlbCsrKSB7XG5cdFx0Ly8gd2hlbiBmaXJzdCBzdGFydGluZyB0aGUgZGlmZiwgY2hlY2sgaWYgd2UncmUgZGlmZmluZyBhbiBTVkcgb3Igd2l0aGluIGFuIFNWR1xuXHRcdGlzU3ZnTW9kZSA9IHBhcmVudCE9bnVsbCAmJiBwYXJlbnQub3duZXJTVkdFbGVtZW50IT09dW5kZWZpbmVkO1xuXG5cdFx0Ly8gaHlkcmF0aW9uIGlzIGluaWRpY2F0ZWQgYnkgdGhlIGV4aXN0aW5nIGVsZW1lbnQgdG8gYmUgZGlmZmVkIG5vdCBoYXZpbmcgYSBwcm9wIGNhY2hlXG5cdFx0aHlkcmF0aW5nID0gZG9tIT1udWxsICYmICEoQVRUUl9LRVkgaW4gZG9tKTtcblx0fVxuXG5cdGxldCByZXQgPSBpZGlmZihkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCwgY29tcG9uZW50Um9vdCk7XG5cblx0Ly8gYXBwZW5kIHRoZSBlbGVtZW50IGlmIGl0cyBhIG5ldyBwYXJlbnRcblx0aWYgKHBhcmVudCAmJiByZXQucGFyZW50Tm9kZSE9PXBhcmVudCkgcGFyZW50LmFwcGVuZENoaWxkKHJldCk7XG5cblx0Ly8gZGlmZkxldmVsIGJlaW5nIHJlZHVjZWQgdG8gMCBtZWFucyB3ZSdyZSBleGl0aW5nIHRoZSBkaWZmXG5cdGlmICghLS1kaWZmTGV2ZWwpIHtcblx0XHRoeWRyYXRpbmcgPSBmYWxzZTtcblx0XHQvLyBpbnZva2UgcXVldWVkIGNvbXBvbmVudERpZE1vdW50IGxpZmVjeWNsZSBtZXRob2RzXG5cdFx0aWYgKCFjb21wb25lbnRSb290KSBmbHVzaE1vdW50cygpO1xuXHR9XG5cblx0cmV0dXJuIHJldDtcbn1cblxuXG4vKiogSW50ZXJuYWxzIG9mIGBkaWZmKClgLCBzZXBhcmF0ZWQgdG8gYWxsb3cgYnlwYXNzaW5nIGRpZmZMZXZlbCAvIG1vdW50IGZsdXNoaW5nLiAqL1xuZnVuY3Rpb24gaWRpZmYoZG9tLCB2bm9kZSwgY29udGV4dCwgbW91bnRBbGwsIGNvbXBvbmVudFJvb3QpIHtcblx0bGV0IG91dCA9IGRvbSxcblx0XHRwcmV2U3ZnTW9kZSA9IGlzU3ZnTW9kZTtcblxuXHQvLyBlbXB0eSB2YWx1ZXMgKG51bGwgJiB1bmRlZmluZWQpIHJlbmRlciBhcyBlbXB0eSBUZXh0IG5vZGVzXG5cdGlmICh2bm9kZT09bnVsbCkgdm5vZGUgPSAnJztcblxuXG5cdC8vIEZhc3QgY2FzZTogU3RyaW5ncyBjcmVhdGUvdXBkYXRlIFRleHQgbm9kZXMuXG5cdGlmICh0eXBlb2Ygdm5vZGU9PT0nc3RyaW5nJykge1xuXG5cdFx0Ly8gdXBkYXRlIGlmIGl0J3MgYWxyZWFkeSBhIFRleHQgbm9kZTpcblx0XHRpZiAoZG9tICYmIGRvbS5zcGxpdFRleHQhPT11bmRlZmluZWQgJiYgZG9tLnBhcmVudE5vZGUgJiYgKCFkb20uX2NvbXBvbmVudCB8fCBjb21wb25lbnRSb290KSkge1xuXHRcdFx0aWYgKGRvbS5ub2RlVmFsdWUhPXZub2RlKSB7XG5cdFx0XHRcdGRvbS5ub2RlVmFsdWUgPSB2bm9kZTtcblx0XHRcdH1cblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHQvLyBpdCB3YXNuJ3QgYSBUZXh0IG5vZGU6IHJlcGxhY2UgaXQgd2l0aCBvbmUgYW5kIHJlY3ljbGUgdGhlIG9sZCBFbGVtZW50XG5cdFx0XHRvdXQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh2bm9kZSk7XG5cdFx0XHRpZiAoZG9tKSB7XG5cdFx0XHRcdGlmIChkb20ucGFyZW50Tm9kZSkgZG9tLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKG91dCwgZG9tKTtcblx0XHRcdFx0cmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCB0cnVlKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRvdXRbQVRUUl9LRVldID0gdHJ1ZTtcblxuXHRcdHJldHVybiBvdXQ7XG5cdH1cblxuXG5cdC8vIElmIHRoZSBWTm9kZSByZXByZXNlbnRzIGEgQ29tcG9uZW50LCBwZXJmb3JtIGEgY29tcG9uZW50IGRpZmY6XG5cdGlmICh0eXBlb2Ygdm5vZGUubm9kZU5hbWU9PT0nZnVuY3Rpb24nKSB7XG5cdFx0cmV0dXJuIGJ1aWxkQ29tcG9uZW50RnJvbVZOb2RlKGRvbSwgdm5vZGUsIGNvbnRleHQsIG1vdW50QWxsKTtcblx0fVxuXG5cblx0Ly8gVHJhY2tzIGVudGVyaW5nIGFuZCBleGl0aW5nIFNWRyBuYW1lc3BhY2Ugd2hlbiBkZXNjZW5kaW5nIHRocm91Z2ggdGhlIHRyZWUuXG5cdGlzU3ZnTW9kZSA9IHZub2RlLm5vZGVOYW1lPT09J3N2ZycgPyB0cnVlIDogdm5vZGUubm9kZU5hbWU9PT0nZm9yZWlnbk9iamVjdCcgPyBmYWxzZSA6IGlzU3ZnTW9kZTtcblxuXG5cdC8vIElmIHRoZXJlJ3Mgbm8gZXhpc3RpbmcgZWxlbWVudCBvciBpdCdzIHRoZSB3cm9uZyB0eXBlLCBjcmVhdGUgYSBuZXcgb25lOlxuXHRpZiAoIWRvbSB8fCAhaXNOYW1lZE5vZGUoZG9tLCBTdHJpbmcodm5vZGUubm9kZU5hbWUpKSkge1xuXHRcdG91dCA9IGNyZWF0ZU5vZGUoU3RyaW5nKHZub2RlLm5vZGVOYW1lKSwgaXNTdmdNb2RlKTtcblxuXHRcdGlmIChkb20pIHtcblx0XHRcdC8vIG1vdmUgY2hpbGRyZW4gaW50byB0aGUgcmVwbGFjZW1lbnQgbm9kZVxuXHRcdFx0d2hpbGUgKGRvbS5maXJzdENoaWxkKSBvdXQuYXBwZW5kQ2hpbGQoZG9tLmZpcnN0Q2hpbGQpO1xuXG5cdFx0XHQvLyBpZiB0aGUgcHJldmlvdXMgRWxlbWVudCB3YXMgbW91bnRlZCBpbnRvIHRoZSBET00sIHJlcGxhY2UgaXQgaW5saW5lXG5cdFx0XHRpZiAoZG9tLnBhcmVudE5vZGUpIGRvbS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChvdXQsIGRvbSk7XG5cblx0XHRcdC8vIHJlY3ljbGUgdGhlIG9sZCBlbGVtZW50IChza2lwcyBub24tRWxlbWVudCBub2RlIHR5cGVzKVxuXHRcdFx0cmVjb2xsZWN0Tm9kZVRyZWUoZG9tLCB0cnVlKTtcblx0XHR9XG5cdH1cblxuXG5cdGxldCBmYyA9IG91dC5maXJzdENoaWxkLFxuXHRcdHByb3BzID0gb3V0W0FUVFJfS0VZXSB8fCAob3V0W0FUVFJfS0VZXSA9IHt9KSxcblx0XHR2Y2hpbGRyZW4gPSB2bm9kZS5jaGlsZHJlbjtcblxuXHQvLyBPcHRpbWl6YXRpb246IGZhc3QtcGF0aCBmb3IgZWxlbWVudHMgY29udGFpbmluZyBhIHNpbmdsZSBUZXh0Tm9kZTpcblx0aWYgKCFoeWRyYXRpbmcgJiYgdmNoaWxkcmVuICYmIHZjaGlsZHJlbi5sZW5ndGg9PT0xICYmIHR5cGVvZiB2Y2hpbGRyZW5bMF09PT0nc3RyaW5nJyAmJiBmYyE9bnVsbCAmJiBmYy5zcGxpdFRleHQhPT11bmRlZmluZWQgJiYgZmMubmV4dFNpYmxpbmc9PW51bGwpIHtcblx0XHRpZiAoZmMubm9kZVZhbHVlIT12Y2hpbGRyZW5bMF0pIHtcblx0XHRcdGZjLm5vZGVWYWx1ZSA9IHZjaGlsZHJlblswXTtcblx0XHR9XG5cdH1cblx0Ly8gb3RoZXJ3aXNlLCBpZiB0aGVyZSBhcmUgZXhpc3Rpbmcgb3IgbmV3IGNoaWxkcmVuLCBkaWZmIHRoZW06XG5cdGVsc2UgaWYgKHZjaGlsZHJlbiAmJiB2Y2hpbGRyZW4ubGVuZ3RoIHx8IGZjIT1udWxsKSB7XG5cdFx0aW5uZXJEaWZmTm9kZShvdXQsIHZjaGlsZHJlbiwgY29udGV4dCwgbW91bnRBbGwsIGh5ZHJhdGluZyB8fCBwcm9wcy5kYW5nZXJvdXNseVNldElubmVySFRNTCE9bnVsbCk7XG5cdH1cblxuXG5cdC8vIEFwcGx5IGF0dHJpYnV0ZXMvcHJvcHMgZnJvbSBWTm9kZSB0byB0aGUgRE9NIEVsZW1lbnQ6XG5cdGRpZmZBdHRyaWJ1dGVzKG91dCwgdm5vZGUuYXR0cmlidXRlcywgcHJvcHMpO1xuXG5cblx0Ly8gcmVzdG9yZSBwcmV2aW91cyBTVkcgbW9kZTogKGluIGNhc2Ugd2UncmUgZXhpdGluZyBhbiBTVkcgbmFtZXNwYWNlKVxuXHRpc1N2Z01vZGUgPSBwcmV2U3ZnTW9kZTtcblxuXHRyZXR1cm4gb3V0O1xufVxuXG5cbi8qKiBBcHBseSBjaGlsZCBhbmQgYXR0cmlidXRlIGNoYW5nZXMgYmV0d2VlbiBhIFZOb2RlIGFuZCBhIERPTSBOb2RlIHRvIHRoZSBET00uXG4gKlx0QHBhcmFtIHtFbGVtZW50fSBkb21cdFx0XHRFbGVtZW50IHdob3NlIGNoaWxkcmVuIHNob3VsZCBiZSBjb21wYXJlZCAmIG11dGF0ZWRcbiAqXHRAcGFyYW0ge0FycmF5fSB2Y2hpbGRyZW5cdFx0QXJyYXkgb2YgVk5vZGVzIHRvIGNvbXBhcmUgdG8gYGRvbS5jaGlsZE5vZGVzYFxuICpcdEBwYXJhbSB7T2JqZWN0fSBjb250ZXh0XHRcdFx0SW1wbGljaXRseSBkZXNjZW5kYW50IGNvbnRleHQgb2JqZWN0IChmcm9tIG1vc3QgcmVjZW50IGBnZXRDaGlsZENvbnRleHQoKWApXG4gKlx0QHBhcmFtIHtCb29sZWFufSBtb3VudEFsbFxuICpcdEBwYXJhbSB7Qm9vbGVhbn0gaXNIeWRyYXRpbmdcdElmIGB0cnVlYCwgY29uc3VtZXMgZXh0ZXJuYWxseSBjcmVhdGVkIGVsZW1lbnRzIHNpbWlsYXIgdG8gaHlkcmF0aW9uXG4gKi9cbmZ1bmN0aW9uIGlubmVyRGlmZk5vZGUoZG9tLCB2Y2hpbGRyZW4sIGNvbnRleHQsIG1vdW50QWxsLCBpc0h5ZHJhdGluZykge1xuXHRsZXQgb3JpZ2luYWxDaGlsZHJlbiA9IGRvbS5jaGlsZE5vZGVzLFxuXHRcdGNoaWxkcmVuID0gW10sXG5cdFx0a2V5ZWQgPSB7fSxcblx0XHRrZXllZExlbiA9IDAsXG5cdFx0bWluID0gMCxcblx0XHRsZW4gPSBvcmlnaW5hbENoaWxkcmVuLmxlbmd0aCxcblx0XHRjaGlsZHJlbkxlbiA9IDAsXG5cdFx0dmxlbiA9IHZjaGlsZHJlbiA/IHZjaGlsZHJlbi5sZW5ndGggOiAwLFxuXHRcdGosIGMsIHZjaGlsZCwgY2hpbGQ7XG5cblx0Ly8gQnVpbGQgdXAgYSBtYXAgb2Yga2V5ZWQgY2hpbGRyZW4gYW5kIGFuIEFycmF5IG9mIHVua2V5ZWQgY2hpbGRyZW46XG5cdGlmIChsZW4hPT0wKSB7XG5cdFx0Zm9yIChsZXQgaT0wOyBpPGxlbjsgaSsrKSB7XG5cdFx0XHRsZXQgY2hpbGQgPSBvcmlnaW5hbENoaWxkcmVuW2ldLFxuXHRcdFx0XHRwcm9wcyA9IGNoaWxkW0FUVFJfS0VZXSxcblx0XHRcdFx0a2V5ID0gdmxlbiAmJiBwcm9wcyA/IGNoaWxkLl9jb21wb25lbnQgPyBjaGlsZC5fY29tcG9uZW50Ll9fa2V5IDogcHJvcHMua2V5IDogbnVsbDtcblx0XHRcdGlmIChrZXkhPW51bGwpIHtcblx0XHRcdFx0a2V5ZWRMZW4rKztcblx0XHRcdFx0a2V5ZWRba2V5XSA9IGNoaWxkO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocHJvcHMgfHwgKGNoaWxkLnNwbGl0VGV4dCE9PXVuZGVmaW5lZCA/IChpc0h5ZHJhdGluZyA/IGNoaWxkLm5vZGVWYWx1ZS50cmltKCkgOiB0cnVlKSA6IGlzSHlkcmF0aW5nKSkge1xuXHRcdFx0XHRjaGlsZHJlbltjaGlsZHJlbkxlbisrXSA9IGNoaWxkO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGlmICh2bGVuIT09MCkge1xuXHRcdGZvciAobGV0IGk9MDsgaTx2bGVuOyBpKyspIHtcblx0XHRcdHZjaGlsZCA9IHZjaGlsZHJlbltpXTtcblx0XHRcdGNoaWxkID0gbnVsbDtcblxuXHRcdFx0Ly8gYXR0ZW1wdCB0byBmaW5kIGEgbm9kZSBiYXNlZCBvbiBrZXkgbWF0Y2hpbmdcblx0XHRcdGxldCBrZXkgPSB2Y2hpbGQua2V5O1xuXHRcdFx0aWYgKGtleSE9bnVsbCkge1xuXHRcdFx0XHRpZiAoa2V5ZWRMZW4gJiYga2V5ZWRba2V5XSE9PXVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdGNoaWxkID0ga2V5ZWRba2V5XTtcblx0XHRcdFx0XHRrZXllZFtrZXldID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdGtleWVkTGVuLS07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdC8vIGF0dGVtcHQgdG8gcGx1Y2sgYSBub2RlIG9mIHRoZSBzYW1lIHR5cGUgZnJvbSB0aGUgZXhpc3RpbmcgY2hpbGRyZW5cblx0XHRcdGVsc2UgaWYgKCFjaGlsZCAmJiBtaW48Y2hpbGRyZW5MZW4pIHtcblx0XHRcdFx0Zm9yIChqPW1pbjsgajxjaGlsZHJlbkxlbjsgaisrKSB7XG5cdFx0XHRcdFx0aWYgKGNoaWxkcmVuW2pdIT09dW5kZWZpbmVkICYmIGlzU2FtZU5vZGVUeXBlKGMgPSBjaGlsZHJlbltqXSwgdmNoaWxkLCBpc0h5ZHJhdGluZykpIHtcblx0XHRcdFx0XHRcdGNoaWxkID0gYztcblx0XHRcdFx0XHRcdGNoaWxkcmVuW2pdID0gdW5kZWZpbmVkO1xuXHRcdFx0XHRcdFx0aWYgKGo9PT1jaGlsZHJlbkxlbi0xKSBjaGlsZHJlbkxlbi0tO1xuXHRcdFx0XHRcdFx0aWYgKGo9PT1taW4pIG1pbisrO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdC8vIG1vcnBoIHRoZSBtYXRjaGVkL2ZvdW5kL2NyZWF0ZWQgRE9NIGNoaWxkIHRvIG1hdGNoIHZjaGlsZCAoZGVlcClcblx0XHRcdGNoaWxkID0gaWRpZmYoY2hpbGQsIHZjaGlsZCwgY29udGV4dCwgbW91bnRBbGwpO1xuXG5cdFx0XHRpZiAoY2hpbGQgJiYgY2hpbGQhPT1kb20pIHtcblx0XHRcdFx0aWYgKGk+PWxlbikge1xuXHRcdFx0XHRcdGRvbS5hcHBlbmRDaGlsZChjaGlsZCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoY2hpbGQhPT1vcmlnaW5hbENoaWxkcmVuW2ldKSB7XG5cdFx0XHRcdFx0aWYgKGNoaWxkPT09b3JpZ2luYWxDaGlsZHJlbltpKzFdKSB7XG5cdFx0XHRcdFx0XHRyZW1vdmVOb2RlKG9yaWdpbmFsQ2hpbGRyZW5baV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGRvbS5pbnNlcnRCZWZvcmUoY2hpbGQsIG9yaWdpbmFsQ2hpbGRyZW5baV0gfHwgbnVsbCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblxuXHQvLyByZW1vdmUgdW51c2VkIGtleWVkIGNoaWxkcmVuOlxuXHRpZiAoa2V5ZWRMZW4pIHtcblx0XHRmb3IgKGxldCBpIGluIGtleWVkKSBpZiAoa2V5ZWRbaV0hPT11bmRlZmluZWQpIHJlY29sbGVjdE5vZGVUcmVlKGtleWVkW2ldLCBmYWxzZSk7XG5cdH1cblxuXHQvLyByZW1vdmUgb3JwaGFuZWQgdW5rZXllZCBjaGlsZHJlbjpcblx0d2hpbGUgKG1pbjw9Y2hpbGRyZW5MZW4pIHtcblx0XHRpZiAoKGNoaWxkID0gY2hpbGRyZW5bY2hpbGRyZW5MZW4tLV0pIT09dW5kZWZpbmVkKSByZWNvbGxlY3ROb2RlVHJlZShjaGlsZCwgZmFsc2UpO1xuXHR9XG59XG5cblxuXG4vKiogUmVjdXJzaXZlbHkgcmVjeWNsZSAob3IganVzdCB1bm1vdW50KSBhIG5vZGUgYW4gaXRzIGRlc2NlbmRhbnRzLlxuICpcdEBwYXJhbSB7Tm9kZX0gbm9kZVx0XHRcdFx0XHRcdERPTSBub2RlIHRvIHN0YXJ0IHVubW91bnQvcmVtb3ZhbCBmcm9tXG4gKlx0QHBhcmFtIHtCb29sZWFufSBbdW5tb3VudE9ubHk9ZmFsc2VdXHRJZiBgdHJ1ZWAsIG9ubHkgdHJpZ2dlcnMgdW5tb3VudCBsaWZlY3ljbGUsIHNraXBzIHJlbW92YWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHVubW91bnRPbmx5KSB7XG5cdGxldCBjb21wb25lbnQgPSBub2RlLl9jb21wb25lbnQ7XG5cdGlmIChjb21wb25lbnQpIHtcblx0XHQvLyBpZiBub2RlIGlzIG93bmVkIGJ5IGEgQ29tcG9uZW50LCB1bm1vdW50IHRoYXQgY29tcG9uZW50IChlbmRzIHVwIHJlY3Vyc2luZyBiYWNrIGhlcmUpXG5cdFx0dW5tb3VudENvbXBvbmVudChjb21wb25lbnQpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdC8vIElmIHRoZSBub2RlJ3MgVk5vZGUgaGFkIGEgcmVmIGZ1bmN0aW9uLCBpbnZva2UgaXQgd2l0aCBudWxsIGhlcmUuXG5cdFx0Ly8gKHRoaXMgaXMgcGFydCBvZiB0aGUgUmVhY3Qgc3BlYywgYW5kIHNtYXJ0IGZvciB1bnNldHRpbmcgcmVmZXJlbmNlcylcblx0XHRpZiAobm9kZVtBVFRSX0tFWV0hPW51bGwgJiYgbm9kZVtBVFRSX0tFWV0ucmVmKSBub2RlW0FUVFJfS0VZXS5yZWYobnVsbCk7XG5cblx0XHRpZiAodW5tb3VudE9ubHk9PT1mYWxzZSB8fCBub2RlW0FUVFJfS0VZXT09bnVsbCkge1xuXHRcdFx0cmVtb3ZlTm9kZShub2RlKTtcblx0XHR9XG5cblx0XHRyZW1vdmVDaGlsZHJlbihub2RlKTtcblx0fVxufVxuXG5cbi8qKiBSZWNvbGxlY3QvdW5tb3VudCBhbGwgY2hpbGRyZW4uXG4gKlx0LSB3ZSB1c2UgLmxhc3RDaGlsZCBoZXJlIGJlY2F1c2UgaXQgY2F1c2VzIGxlc3MgcmVmbG93IHRoYW4gLmZpcnN0Q2hpbGRcbiAqXHQtIGl0J3MgYWxzbyBjaGVhcGVyIHRoYW4gYWNjZXNzaW5nIHRoZSAuY2hpbGROb2RlcyBMaXZlIE5vZGVMaXN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVDaGlsZHJlbihub2RlKSB7XG5cdG5vZGUgPSBub2RlLmxhc3RDaGlsZDtcblx0d2hpbGUgKG5vZGUpIHtcblx0XHRsZXQgbmV4dCA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuXHRcdHJlY29sbGVjdE5vZGVUcmVlKG5vZGUsIHRydWUpO1xuXHRcdG5vZGUgPSBuZXh0O1xuXHR9XG59XG5cblxuLyoqIEFwcGx5IGRpZmZlcmVuY2VzIGluIGF0dHJpYnV0ZXMgZnJvbSBhIFZOb2RlIHRvIHRoZSBnaXZlbiBET00gRWxlbWVudC5cbiAqXHRAcGFyYW0ge0VsZW1lbnR9IGRvbVx0XHRFbGVtZW50IHdpdGggYXR0cmlidXRlcyB0byBkaWZmIGBhdHRyc2AgYWdhaW5zdFxuICpcdEBwYXJhbSB7T2JqZWN0fSBhdHRyc1x0XHRUaGUgZGVzaXJlZCBlbmQtc3RhdGUga2V5LXZhbHVlIGF0dHJpYnV0ZSBwYWlyc1xuICpcdEBwYXJhbSB7T2JqZWN0fSBvbGRcdFx0XHRDdXJyZW50L3ByZXZpb3VzIGF0dHJpYnV0ZXMgKGZyb20gcHJldmlvdXMgVk5vZGUgb3IgZWxlbWVudCdzIHByb3AgY2FjaGUpXG4gKi9cbmZ1bmN0aW9uIGRpZmZBdHRyaWJ1dGVzKGRvbSwgYXR0cnMsIG9sZCkge1xuXHRsZXQgbmFtZTtcblxuXHQvLyByZW1vdmUgYXR0cmlidXRlcyBubyBsb25nZXIgcHJlc2VudCBvbiB0aGUgdm5vZGUgYnkgc2V0dGluZyB0aGVtIHRvIHVuZGVmaW5lZFxuXHRmb3IgKG5hbWUgaW4gb2xkKSB7XG5cdFx0aWYgKCEoYXR0cnMgJiYgYXR0cnNbbmFtZV0hPW51bGwpICYmIG9sZFtuYW1lXSE9bnVsbCkge1xuXHRcdFx0c2V0QWNjZXNzb3IoZG9tLCBuYW1lLCBvbGRbbmFtZV0sIG9sZFtuYW1lXSA9IHVuZGVmaW5lZCwgaXNTdmdNb2RlKTtcblx0XHR9XG5cdH1cblxuXHQvLyBhZGQgbmV3ICYgdXBkYXRlIGNoYW5nZWQgYXR0cmlidXRlc1xuXHRmb3IgKG5hbWUgaW4gYXR0cnMpIHtcblx0XHRpZiAobmFtZSE9PSdjaGlsZHJlbicgJiYgbmFtZSE9PSdpbm5lckhUTUwnICYmICghKG5hbWUgaW4gb2xkKSB8fCBhdHRyc1tuYW1lXSE9PShuYW1lPT09J3ZhbHVlJyB8fCBuYW1lPT09J2NoZWNrZWQnID8gZG9tW25hbWVdIDogb2xkW25hbWVdKSkpIHtcblx0XHRcdHNldEFjY2Vzc29yKGRvbSwgbmFtZSwgb2xkW25hbWVdLCBvbGRbbmFtZV0gPSBhdHRyc1tuYW1lXSwgaXNTdmdNb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvdmRvbS9kaWZmLmpzIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vY29tcG9uZW50JztcblxuLyoqIFJldGFpbnMgYSBwb29sIG9mIENvbXBvbmVudHMgZm9yIHJlLXVzZSwga2V5ZWQgb24gY29tcG9uZW50IG5hbWUuXG4gKlx0Tm90ZTogc2luY2UgY29tcG9uZW50IG5hbWVzIGFyZSBub3QgdW5pcXVlIG9yIGV2ZW4gbmVjZXNzYXJpbHkgYXZhaWxhYmxlLCB0aGVzZSBhcmUgcHJpbWFyaWx5IGEgZm9ybSBvZiBzaGFyZGluZy5cbiAqXHRAcHJpdmF0ZVxuICovXG5jb25zdCBjb21wb25lbnRzID0ge307XG5cblxuLyoqIFJlY2xhaW0gYSBjb21wb25lbnQgZm9yIGxhdGVyIHJlLXVzZSBieSB0aGUgcmVjeWNsZXIuICovXG5leHBvcnQgZnVuY3Rpb24gY29sbGVjdENvbXBvbmVudChjb21wb25lbnQpIHtcblx0bGV0IG5hbWUgPSBjb21wb25lbnQuY29uc3RydWN0b3IubmFtZTtcblx0KGNvbXBvbmVudHNbbmFtZV0gfHwgKGNvbXBvbmVudHNbbmFtZV0gPSBbXSkpLnB1c2goY29tcG9uZW50KTtcbn1cblxuXG4vKiogQ3JlYXRlIGEgY29tcG9uZW50LiBOb3JtYWxpemVzIGRpZmZlcmVuY2VzIGJldHdlZW4gUEZDJ3MgYW5kIGNsYXNzZnVsIENvbXBvbmVudHMuICovXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlQ29tcG9uZW50KEN0b3IsIHByb3BzLCBjb250ZXh0KSB7XG5cdGxldCBsaXN0ID0gY29tcG9uZW50c1tDdG9yLm5hbWVdLFxuXHRcdGluc3Q7XG5cblx0aWYgKEN0b3IucHJvdG90eXBlICYmIEN0b3IucHJvdG90eXBlLnJlbmRlcikge1xuXHRcdGluc3QgPSBuZXcgQ3Rvcihwcm9wcywgY29udGV4dCk7XG5cdFx0Q29tcG9uZW50LmNhbGwoaW5zdCwgcHJvcHMsIGNvbnRleHQpO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGluc3QgPSBuZXcgQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KTtcblx0XHRpbnN0LmNvbnN0cnVjdG9yID0gQ3Rvcjtcblx0XHRpbnN0LnJlbmRlciA9IGRvUmVuZGVyO1xuXHR9XG5cblxuXHRpZiAobGlzdCkge1xuXHRcdGZvciAobGV0IGk9bGlzdC5sZW5ndGg7IGktLTsgKSB7XG5cdFx0XHRpZiAobGlzdFtpXS5jb25zdHJ1Y3Rvcj09PUN0b3IpIHtcblx0XHRcdFx0aW5zdC5uZXh0QmFzZSA9IGxpc3RbaV0ubmV4dEJhc2U7XG5cdFx0XHRcdGxpc3Quc3BsaWNlKGksIDEpO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGluc3Q7XG59XG5cblxuLyoqIFRoZSBgLnJlbmRlcigpYCBtZXRob2QgZm9yIGEgUEZDIGJhY2tpbmcgaW5zdGFuY2UuICovXG5mdW5jdGlvbiBkb1JlbmRlcihwcm9wcywgc3RhdGUsIGNvbnRleHQpIHtcblx0cmV0dXJuIHRoaXMuY29uc3RydWN0b3IocHJvcHMsIGNvbnRleHQpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy92ZG9tL2NvbXBvbmVudC1yZWN5Y2xlci5qcyIsImltcG9ydCB7IFNZTkNfUkVOREVSLCBOT19SRU5ERVIsIEZPUkNFX1JFTkRFUiwgQVNZTkNfUkVOREVSLCBBVFRSX0tFWSB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQgb3B0aW9ucyBmcm9tICcuLi9vcHRpb25zJztcbmltcG9ydCB7IGV4dGVuZCB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHsgZW5xdWV1ZVJlbmRlciB9IGZyb20gJy4uL3JlbmRlci1xdWV1ZSc7XG5pbXBvcnQgeyBnZXROb2RlUHJvcHMgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7IGRpZmYsIG1vdW50cywgZGlmZkxldmVsLCBmbHVzaE1vdW50cywgcmVjb2xsZWN0Tm9kZVRyZWUsIHJlbW92ZUNoaWxkcmVuIH0gZnJvbSAnLi9kaWZmJztcbmltcG9ydCB7IGNyZWF0ZUNvbXBvbmVudCwgY29sbGVjdENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50LXJlY3ljbGVyJztcbmltcG9ydCB7IHJlbW92ZU5vZGUgfSBmcm9tICcuLi9kb20nO1xuXG4vKiogU2V0IGEgY29tcG9uZW50J3MgYHByb3BzYCAoZ2VuZXJhbGx5IGRlcml2ZWQgZnJvbSBKU1ggYXR0cmlidXRlcykuXG4gKlx0QHBhcmFtIHtPYmplY3R9IHByb3BzXG4gKlx0QHBhcmFtIHtPYmplY3R9IFtvcHRzXVxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMucmVuZGVyU3luYz1mYWxzZV1cdElmIGB0cnVlYCBhbmQge0BsaW5rIG9wdGlvbnMuc3luY0NvbXBvbmVudFVwZGF0ZXN9IGlzIGB0cnVlYCwgdHJpZ2dlcnMgc3luY2hyb25vdXMgcmVuZGVyaW5nLlxuICpcdEBwYXJhbSB7Ym9vbGVhbn0gW29wdHMucmVuZGVyPXRydWVdXHRcdFx0SWYgYGZhbHNlYCwgbm8gcmVuZGVyIHdpbGwgYmUgdHJpZ2dlcmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0Q29tcG9uZW50UHJvcHMoY29tcG9uZW50LCBwcm9wcywgb3B0cywgY29udGV4dCwgbW91bnRBbGwpIHtcblx0aWYgKGNvbXBvbmVudC5fZGlzYWJsZSkgcmV0dXJuO1xuXHRjb21wb25lbnQuX2Rpc2FibGUgPSB0cnVlO1xuXG5cdGlmICgoY29tcG9uZW50Ll9fcmVmID0gcHJvcHMucmVmKSkgZGVsZXRlIHByb3BzLnJlZjtcblx0aWYgKChjb21wb25lbnQuX19rZXkgPSBwcm9wcy5rZXkpKSBkZWxldGUgcHJvcHMua2V5O1xuXG5cdGlmICghY29tcG9uZW50LmJhc2UgfHwgbW91bnRBbGwpIHtcblx0XHRpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCkgY29tcG9uZW50LmNvbXBvbmVudFdpbGxNb3VudCgpO1xuXHR9XG5cdGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKSB7XG5cdFx0Y29tcG9uZW50LmNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHMocHJvcHMsIGNvbnRleHQpO1xuXHR9XG5cblx0aWYgKGNvbnRleHQgJiYgY29udGV4dCE9PWNvbXBvbmVudC5jb250ZXh0KSB7XG5cdFx0aWYgKCFjb21wb25lbnQucHJldkNvbnRleHQpIGNvbXBvbmVudC5wcmV2Q29udGV4dCA9IGNvbXBvbmVudC5jb250ZXh0O1xuXHRcdGNvbXBvbmVudC5jb250ZXh0ID0gY29udGV4dDtcblx0fVxuXG5cdGlmICghY29tcG9uZW50LnByZXZQcm9wcykgY29tcG9uZW50LnByZXZQcm9wcyA9IGNvbXBvbmVudC5wcm9wcztcblx0Y29tcG9uZW50LnByb3BzID0gcHJvcHM7XG5cblx0Y29tcG9uZW50Ll9kaXNhYmxlID0gZmFsc2U7XG5cblx0aWYgKG9wdHMhPT1OT19SRU5ERVIpIHtcblx0XHRpZiAob3B0cz09PVNZTkNfUkVOREVSIHx8IG9wdGlvbnMuc3luY0NvbXBvbmVudFVwZGF0ZXMhPT1mYWxzZSB8fCAhY29tcG9uZW50LmJhc2UpIHtcblx0XHRcdHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIFNZTkNfUkVOREVSLCBtb3VudEFsbCk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0ZW5xdWV1ZVJlbmRlcihjb21wb25lbnQpO1xuXHRcdH1cblx0fVxuXG5cdGlmIChjb21wb25lbnQuX19yZWYpIGNvbXBvbmVudC5fX3JlZihjb21wb25lbnQpO1xufVxuXG5cblxuLyoqIFJlbmRlciBhIENvbXBvbmVudCwgdHJpZ2dlcmluZyBuZWNlc3NhcnkgbGlmZWN5Y2xlIGV2ZW50cyBhbmQgdGFraW5nIEhpZ2gtT3JkZXIgQ29tcG9uZW50cyBpbnRvIGFjY291bnQuXG4gKlx0QHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudFxuICpcdEBwYXJhbSB7T2JqZWN0fSBbb3B0c11cbiAqXHRAcGFyYW0ge2Jvb2xlYW59IFtvcHRzLmJ1aWxkPWZhbHNlXVx0XHRJZiBgdHJ1ZWAsIGNvbXBvbmVudCB3aWxsIGJ1aWxkIGFuZCBzdG9yZSBhIERPTSBub2RlIGlmIG5vdCBhbHJlYWR5IGFzc29jaWF0ZWQgd2l0aCBvbmUuXG4gKlx0QHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlckNvbXBvbmVudChjb21wb25lbnQsIG9wdHMsIG1vdW50QWxsLCBpc0NoaWxkKSB7XG5cdGlmIChjb21wb25lbnQuX2Rpc2FibGUpIHJldHVybjtcblxuXHRsZXQgcHJvcHMgPSBjb21wb25lbnQucHJvcHMsXG5cdFx0c3RhdGUgPSBjb21wb25lbnQuc3RhdGUsXG5cdFx0Y29udGV4dCA9IGNvbXBvbmVudC5jb250ZXh0LFxuXHRcdHByZXZpb3VzUHJvcHMgPSBjb21wb25lbnQucHJldlByb3BzIHx8IHByb3BzLFxuXHRcdHByZXZpb3VzU3RhdGUgPSBjb21wb25lbnQucHJldlN0YXRlIHx8IHN0YXRlLFxuXHRcdHByZXZpb3VzQ29udGV4dCA9IGNvbXBvbmVudC5wcmV2Q29udGV4dCB8fCBjb250ZXh0LFxuXHRcdGlzVXBkYXRlID0gY29tcG9uZW50LmJhc2UsXG5cdFx0bmV4dEJhc2UgPSBjb21wb25lbnQubmV4dEJhc2UsXG5cdFx0aW5pdGlhbEJhc2UgPSBpc1VwZGF0ZSB8fCBuZXh0QmFzZSxcblx0XHRpbml0aWFsQ2hpbGRDb21wb25lbnQgPSBjb21wb25lbnQuX2NvbXBvbmVudCxcblx0XHRza2lwID0gZmFsc2UsXG5cdFx0cmVuZGVyZWQsIGluc3QsIGNiYXNlO1xuXG5cdC8vIGlmIHVwZGF0aW5nXG5cdGlmIChpc1VwZGF0ZSkge1xuXHRcdGNvbXBvbmVudC5wcm9wcyA9IHByZXZpb3VzUHJvcHM7XG5cdFx0Y29tcG9uZW50LnN0YXRlID0gcHJldmlvdXNTdGF0ZTtcblx0XHRjb21wb25lbnQuY29udGV4dCA9IHByZXZpb3VzQ29udGV4dDtcblx0XHRpZiAob3B0cyE9PUZPUkNFX1JFTkRFUlxuXHRcdFx0JiYgY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZVxuXHRcdFx0JiYgY29tcG9uZW50LnNob3VsZENvbXBvbmVudFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpID09PSBmYWxzZSkge1xuXHRcdFx0c2tpcCA9IHRydWU7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKGNvbXBvbmVudC5jb21wb25lbnRXaWxsVXBkYXRlKSB7XG5cdFx0XHRjb21wb25lbnQuY29tcG9uZW50V2lsbFVwZGF0ZShwcm9wcywgc3RhdGUsIGNvbnRleHQpO1xuXHRcdH1cblx0XHRjb21wb25lbnQucHJvcHMgPSBwcm9wcztcblx0XHRjb21wb25lbnQuc3RhdGUgPSBzdGF0ZTtcblx0XHRjb21wb25lbnQuY29udGV4dCA9IGNvbnRleHQ7XG5cdH1cblxuXHRjb21wb25lbnQucHJldlByb3BzID0gY29tcG9uZW50LnByZXZTdGF0ZSA9IGNvbXBvbmVudC5wcmV2Q29udGV4dCA9IGNvbXBvbmVudC5uZXh0QmFzZSA9IG51bGw7XG5cdGNvbXBvbmVudC5fZGlydHkgPSBmYWxzZTtcblxuXHRpZiAoIXNraXApIHtcblx0XHRyZW5kZXJlZCA9IGNvbXBvbmVudC5yZW5kZXIocHJvcHMsIHN0YXRlLCBjb250ZXh0KTtcblxuXHRcdC8vIGNvbnRleHQgdG8gcGFzcyB0byB0aGUgY2hpbGQsIGNhbiBiZSB1cGRhdGVkIHZpYSAoZ3JhbmQtKXBhcmVudCBjb21wb25lbnRcblx0XHRpZiAoY29tcG9uZW50LmdldENoaWxkQ29udGV4dCkge1xuXHRcdFx0Y29udGV4dCA9IGV4dGVuZChleHRlbmQoe30sIGNvbnRleHQpLCBjb21wb25lbnQuZ2V0Q2hpbGRDb250ZXh0KCkpO1xuXHRcdH1cblxuXHRcdGxldCBjaGlsZENvbXBvbmVudCA9IHJlbmRlcmVkICYmIHJlbmRlcmVkLm5vZGVOYW1lLFxuXHRcdFx0dG9Vbm1vdW50LCBiYXNlO1xuXG5cdFx0aWYgKHR5cGVvZiBjaGlsZENvbXBvbmVudD09PSdmdW5jdGlvbicpIHtcblx0XHRcdC8vIHNldCB1cCBoaWdoIG9yZGVyIGNvbXBvbmVudCBsaW5rXG5cblx0XHRcdGxldCBjaGlsZFByb3BzID0gZ2V0Tm9kZVByb3BzKHJlbmRlcmVkKTtcblx0XHRcdGluc3QgPSBpbml0aWFsQ2hpbGRDb21wb25lbnQ7XG5cblx0XHRcdGlmIChpbnN0ICYmIGluc3QuY29uc3RydWN0b3I9PT1jaGlsZENvbXBvbmVudCAmJiBjaGlsZFByb3BzLmtleT09aW5zdC5fX2tleSkge1xuXHRcdFx0XHRzZXRDb21wb25lbnRQcm9wcyhpbnN0LCBjaGlsZFByb3BzLCBTWU5DX1JFTkRFUiwgY29udGV4dCwgZmFsc2UpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHRvVW5tb3VudCA9IGluc3Q7XG5cblx0XHRcdFx0Y29tcG9uZW50Ll9jb21wb25lbnQgPSBpbnN0ID0gY3JlYXRlQ29tcG9uZW50KGNoaWxkQ29tcG9uZW50LCBjaGlsZFByb3BzLCBjb250ZXh0KTtcblx0XHRcdFx0aW5zdC5uZXh0QmFzZSA9IGluc3QubmV4dEJhc2UgfHwgbmV4dEJhc2U7XG5cdFx0XHRcdGluc3QuX3BhcmVudENvbXBvbmVudCA9IGNvbXBvbmVudDtcblx0XHRcdFx0c2V0Q29tcG9uZW50UHJvcHMoaW5zdCwgY2hpbGRQcm9wcywgTk9fUkVOREVSLCBjb250ZXh0LCBmYWxzZSk7XG5cdFx0XHRcdHJlbmRlckNvbXBvbmVudChpbnN0LCBTWU5DX1JFTkRFUiwgbW91bnRBbGwsIHRydWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRiYXNlID0gaW5zdC5iYXNlO1xuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdGNiYXNlID0gaW5pdGlhbEJhc2U7XG5cblx0XHRcdC8vIGRlc3Ryb3kgaGlnaCBvcmRlciBjb21wb25lbnQgbGlua1xuXHRcdFx0dG9Vbm1vdW50ID0gaW5pdGlhbENoaWxkQ29tcG9uZW50O1xuXHRcdFx0aWYgKHRvVW5tb3VudCkge1xuXHRcdFx0XHRjYmFzZSA9IGNvbXBvbmVudC5fY29tcG9uZW50ID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGluaXRpYWxCYXNlIHx8IG9wdHM9PT1TWU5DX1JFTkRFUikge1xuXHRcdFx0XHRpZiAoY2Jhc2UpIGNiYXNlLl9jb21wb25lbnQgPSBudWxsO1xuXHRcdFx0XHRiYXNlID0gZGlmZihjYmFzZSwgcmVuZGVyZWQsIGNvbnRleHQsIG1vdW50QWxsIHx8ICFpc1VwZGF0ZSwgaW5pdGlhbEJhc2UgJiYgaW5pdGlhbEJhc2UucGFyZW50Tm9kZSwgdHJ1ZSk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKGluaXRpYWxCYXNlICYmIGJhc2UhPT1pbml0aWFsQmFzZSAmJiBpbnN0IT09aW5pdGlhbENoaWxkQ29tcG9uZW50KSB7XG5cdFx0XHRsZXQgYmFzZVBhcmVudCA9IGluaXRpYWxCYXNlLnBhcmVudE5vZGU7XG5cdFx0XHRpZiAoYmFzZVBhcmVudCAmJiBiYXNlIT09YmFzZVBhcmVudCkge1xuXHRcdFx0XHRiYXNlUGFyZW50LnJlcGxhY2VDaGlsZChiYXNlLCBpbml0aWFsQmFzZSk7XG5cblx0XHRcdFx0aWYgKCF0b1VubW91bnQpIHtcblx0XHRcdFx0XHRpbml0aWFsQmFzZS5fY29tcG9uZW50ID0gbnVsbDtcblx0XHRcdFx0XHRyZWNvbGxlY3ROb2RlVHJlZShpbml0aWFsQmFzZSwgZmFsc2UpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYgKHRvVW5tb3VudCkge1xuXHRcdFx0dW5tb3VudENvbXBvbmVudCh0b1VubW91bnQpO1xuXHRcdH1cblxuXHRcdGNvbXBvbmVudC5iYXNlID0gYmFzZTtcblx0XHRpZiAoYmFzZSAmJiAhaXNDaGlsZCkge1xuXHRcdFx0bGV0IGNvbXBvbmVudFJlZiA9IGNvbXBvbmVudCxcblx0XHRcdFx0dCA9IGNvbXBvbmVudDtcblx0XHRcdHdoaWxlICgodD10Ll9wYXJlbnRDb21wb25lbnQpKSB7XG5cdFx0XHRcdChjb21wb25lbnRSZWYgPSB0KS5iYXNlID0gYmFzZTtcblx0XHRcdH1cblx0XHRcdGJhc2UuX2NvbXBvbmVudCA9IGNvbXBvbmVudFJlZjtcblx0XHRcdGJhc2UuX2NvbXBvbmVudENvbnN0cnVjdG9yID0gY29tcG9uZW50UmVmLmNvbnN0cnVjdG9yO1xuXHRcdH1cblx0fVxuXG5cdGlmICghaXNVcGRhdGUgfHwgbW91bnRBbGwpIHtcblx0XHRtb3VudHMudW5zaGlmdChjb21wb25lbnQpO1xuXHR9XG5cdGVsc2UgaWYgKCFza2lwKSB7XG5cdFx0Ly8gRW5zdXJlIHRoYXQgcGVuZGluZyBjb21wb25lbnREaWRNb3VudCgpIGhvb2tzIG9mIGNoaWxkIGNvbXBvbmVudHNcblx0XHQvLyBhcmUgY2FsbGVkIGJlZm9yZSB0aGUgY29tcG9uZW50RGlkVXBkYXRlKCkgaG9vayBpbiB0aGUgcGFyZW50LlxuXHRcdGZsdXNoTW91bnRzKCk7XG5cblx0XHRpZiAoY29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZSkge1xuXHRcdFx0Y29tcG9uZW50LmNvbXBvbmVudERpZFVwZGF0ZShwcmV2aW91c1Byb3BzLCBwcmV2aW91c1N0YXRlLCBwcmV2aW91c0NvbnRleHQpO1xuXHRcdH1cblx0XHRpZiAob3B0aW9ucy5hZnRlclVwZGF0ZSkgb3B0aW9ucy5hZnRlclVwZGF0ZShjb21wb25lbnQpO1xuXHR9XG5cblx0aWYgKGNvbXBvbmVudC5fcmVuZGVyQ2FsbGJhY2tzIT1udWxsKSB7XG5cdFx0d2hpbGUgKGNvbXBvbmVudC5fcmVuZGVyQ2FsbGJhY2tzLmxlbmd0aCkgY29tcG9uZW50Ll9yZW5kZXJDYWxsYmFja3MucG9wKCkuY2FsbChjb21wb25lbnQpO1xuXHR9XG5cblx0aWYgKCFkaWZmTGV2ZWwgJiYgIWlzQ2hpbGQpIGZsdXNoTW91bnRzKCk7XG59XG5cblxuXG4vKiogQXBwbHkgdGhlIENvbXBvbmVudCByZWZlcmVuY2VkIGJ5IGEgVk5vZGUgdG8gdGhlIERPTS5cbiAqXHRAcGFyYW0ge0VsZW1lbnR9IGRvbVx0VGhlIERPTSBub2RlIHRvIG11dGF0ZVxuICpcdEBwYXJhbSB7Vk5vZGV9IHZub2RlXHRBIENvbXBvbmVudC1yZWZlcmVuY2luZyBWTm9kZVxuICpcdEByZXR1cm5zIHtFbGVtZW50fSBkb21cdFRoZSBjcmVhdGVkL211dGF0ZWQgZWxlbWVudFxuICpcdEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWlsZENvbXBvbmVudEZyb21WTm9kZShkb20sIHZub2RlLCBjb250ZXh0LCBtb3VudEFsbCkge1xuXHRsZXQgYyA9IGRvbSAmJiBkb20uX2NvbXBvbmVudCxcblx0XHRvcmlnaW5hbENvbXBvbmVudCA9IGMsXG5cdFx0b2xkRG9tID0gZG9tLFxuXHRcdGlzRGlyZWN0T3duZXIgPSBjICYmIGRvbS5fY29tcG9uZW50Q29uc3RydWN0b3I9PT12bm9kZS5ub2RlTmFtZSxcblx0XHRpc093bmVyID0gaXNEaXJlY3RPd25lcixcblx0XHRwcm9wcyA9IGdldE5vZGVQcm9wcyh2bm9kZSk7XG5cdHdoaWxlIChjICYmICFpc093bmVyICYmIChjPWMuX3BhcmVudENvbXBvbmVudCkpIHtcblx0XHRpc093bmVyID0gYy5jb25zdHJ1Y3Rvcj09PXZub2RlLm5vZGVOYW1lO1xuXHR9XG5cblx0aWYgKGMgJiYgaXNPd25lciAmJiAoIW1vdW50QWxsIHx8IGMuX2NvbXBvbmVudCkpIHtcblx0XHRzZXRDb21wb25lbnRQcm9wcyhjLCBwcm9wcywgQVNZTkNfUkVOREVSLCBjb250ZXh0LCBtb3VudEFsbCk7XG5cdFx0ZG9tID0gYy5iYXNlO1xuXHR9XG5cdGVsc2Uge1xuXHRcdGlmIChvcmlnaW5hbENvbXBvbmVudCAmJiAhaXNEaXJlY3RPd25lcikge1xuXHRcdFx0dW5tb3VudENvbXBvbmVudChvcmlnaW5hbENvbXBvbmVudCk7XG5cdFx0XHRkb20gPSBvbGREb20gPSBudWxsO1xuXHRcdH1cblxuXHRcdGMgPSBjcmVhdGVDb21wb25lbnQodm5vZGUubm9kZU5hbWUsIHByb3BzLCBjb250ZXh0KTtcblx0XHRpZiAoZG9tICYmICFjLm5leHRCYXNlKSB7XG5cdFx0XHRjLm5leHRCYXNlID0gZG9tO1xuXHRcdFx0Ly8gcGFzc2luZyBkb20vb2xkRG9tIGFzIG5leHRCYXNlIHdpbGwgcmVjeWNsZSBpdCBpZiB1bnVzZWQsIHNvIGJ5cGFzcyByZWN5Y2xpbmcgb24gTDIyOTpcblx0XHRcdG9sZERvbSA9IG51bGw7XG5cdFx0fVxuXHRcdHNldENvbXBvbmVudFByb3BzKGMsIHByb3BzLCBTWU5DX1JFTkRFUiwgY29udGV4dCwgbW91bnRBbGwpO1xuXHRcdGRvbSA9IGMuYmFzZTtcblxuXHRcdGlmIChvbGREb20gJiYgZG9tIT09b2xkRG9tKSB7XG5cdFx0XHRvbGREb20uX2NvbXBvbmVudCA9IG51bGw7XG5cdFx0XHRyZWNvbGxlY3ROb2RlVHJlZShvbGREb20sIGZhbHNlKTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gZG9tO1xufVxuXG5cblxuLyoqIFJlbW92ZSBhIGNvbXBvbmVudCBmcm9tIHRoZSBET00gYW5kIHJlY3ljbGUgaXQuXG4gKlx0QHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudFx0VGhlIENvbXBvbmVudCBpbnN0YW5jZSB0byB1bm1vdW50XG4gKlx0QHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVubW91bnRDb21wb25lbnQoY29tcG9uZW50KSB7XG5cdGlmIChvcHRpb25zLmJlZm9yZVVubW91bnQpIG9wdGlvbnMuYmVmb3JlVW5tb3VudChjb21wb25lbnQpO1xuXG5cdGxldCBiYXNlID0gY29tcG9uZW50LmJhc2U7XG5cblx0Y29tcG9uZW50Ll9kaXNhYmxlID0gdHJ1ZTtcblxuXHRpZiAoY29tcG9uZW50LmNvbXBvbmVudFdpbGxVbm1vdW50KSBjb21wb25lbnQuY29tcG9uZW50V2lsbFVubW91bnQoKTtcblxuXHRjb21wb25lbnQuYmFzZSA9IG51bGw7XG5cblx0Ly8gcmVjdXJzaXZlbHkgdGVhciBkb3duICYgcmVjb2xsZWN0IGhpZ2gtb3JkZXIgY29tcG9uZW50IGNoaWxkcmVuOlxuXHRsZXQgaW5uZXIgPSBjb21wb25lbnQuX2NvbXBvbmVudDtcblx0aWYgKGlubmVyKSB7XG5cdFx0dW5tb3VudENvbXBvbmVudChpbm5lcik7XG5cdH1cblx0ZWxzZSBpZiAoYmFzZSkge1xuXHRcdGlmIChiYXNlW0FUVFJfS0VZXSAmJiBiYXNlW0FUVFJfS0VZXS5yZWYpIGJhc2VbQVRUUl9LRVldLnJlZihudWxsKTtcblxuXHRcdGNvbXBvbmVudC5uZXh0QmFzZSA9IGJhc2U7XG5cblx0XHRyZW1vdmVOb2RlKGJhc2UpO1xuXHRcdGNvbGxlY3RDb21wb25lbnQoY29tcG9uZW50KTtcblxuXHRcdHJlbW92ZUNoaWxkcmVuKGJhc2UpO1xuXHR9XG5cblx0aWYgKGNvbXBvbmVudC5fX3JlZikgY29tcG9uZW50Ll9fcmVmKG51bGwpO1xufVxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy92ZG9tL2NvbXBvbmVudC5qcyIsIi8qKiBHbG9iYWwgb3B0aW9uc1xuICpcdEBwdWJsaWNcbiAqXHRAbmFtZXNwYWNlIG9wdGlvbnMge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuXG5cdC8qKiBJZiBgdHJ1ZWAsIGBwcm9wYCBjaGFuZ2VzIHRyaWdnZXIgc3luY2hyb25vdXMgY29tcG9uZW50IHVwZGF0ZXMuXG5cdCAqXHRAbmFtZSBzeW5jQ29tcG9uZW50VXBkYXRlc1xuXHQgKlx0QHR5cGUgQm9vbGVhblxuXHQgKlx0QGRlZmF1bHQgdHJ1ZVxuXHQgKi9cblx0Ly9zeW5jQ29tcG9uZW50VXBkYXRlczogdHJ1ZSxcblxuXHQvKiogUHJvY2Vzc2VzIGFsbCBjcmVhdGVkIFZOb2Rlcy5cblx0ICpcdEBwYXJhbSB7Vk5vZGV9IHZub2RlXHRBIG5ld2x5LWNyZWF0ZWQgVk5vZGUgdG8gbm9ybWFsaXplL3Byb2Nlc3Ncblx0ICovXG5cdC8vdm5vZGUodm5vZGUpIHsgfVxuXG5cdC8qKiBIb29rIGludm9rZWQgYWZ0ZXIgYSBjb21wb25lbnQgaXMgbW91bnRlZC4gKi9cblx0Ly8gYWZ0ZXJNb3VudChjb21wb25lbnQpIHsgfVxuXG5cdC8qKiBIb29rIGludm9rZWQgYWZ0ZXIgdGhlIERPTSBpcyB1cGRhdGVkIHdpdGggYSBjb21wb25lbnQncyBsYXRlc3QgcmVuZGVyLiAqL1xuXHQvLyBhZnRlclVwZGF0ZShjb21wb25lbnQpIHsgfVxuXG5cdC8qKiBIb29rIGludm9rZWQgaW1tZWRpYXRlbHkgYmVmb3JlIGEgY29tcG9uZW50IGlzIHVubW91bnRlZC4gKi9cblx0Ly8gYmVmb3JlVW5tb3VudChjb21wb25lbnQpIHsgfVxufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvb3B0aW9ucy5qcyIsImltcG9ydCB7IEZPUkNFX1JFTkRFUiB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IGV4dGVuZCB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyByZW5kZXJDb21wb25lbnQgfSBmcm9tICcuL3Zkb20vY29tcG9uZW50JztcbmltcG9ydCB7IGVucXVldWVSZW5kZXIgfSBmcm9tICcuL3JlbmRlci1xdWV1ZSc7XG5cbi8qKiBCYXNlIENvbXBvbmVudCBjbGFzcy5cbiAqXHRQcm92aWRlcyBgc2V0U3RhdGUoKWAgYW5kIGBmb3JjZVVwZGF0ZSgpYCwgd2hpY2ggdHJpZ2dlciByZW5kZXJpbmcuXG4gKlx0QHB1YmxpY1xuICpcbiAqXHRAZXhhbXBsZVxuICpcdGNsYXNzIE15Rm9vIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAqXHRcdHJlbmRlcihwcm9wcywgc3RhdGUpIHtcbiAqXHRcdFx0cmV0dXJuIDxkaXYgLz47XG4gKlx0XHR9XG4gKlx0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gQ29tcG9uZW50KHByb3BzLCBjb250ZXh0KSB7XG5cdHRoaXMuX2RpcnR5ID0gdHJ1ZTtcblxuXHQvKiogQHB1YmxpY1xuXHQgKlx0QHR5cGUge29iamVjdH1cblx0ICovXG5cdHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG5cblx0LyoqIEBwdWJsaWNcblx0ICpcdEB0eXBlIHtvYmplY3R9XG5cdCAqL1xuXHR0aGlzLnByb3BzID0gcHJvcHM7XG5cblx0LyoqIEBwdWJsaWNcblx0ICpcdEB0eXBlIHtvYmplY3R9XG5cdCAqL1xuXHR0aGlzLnN0YXRlID0gdGhpcy5zdGF0ZSB8fCB7fTtcbn1cblxuXG5leHRlbmQoQ29tcG9uZW50LnByb3RvdHlwZSwge1xuXG5cdC8qKiBSZXR1cm5zIGEgYGJvb2xlYW5gIGluZGljYXRpbmcgaWYgdGhlIGNvbXBvbmVudCBzaG91bGQgcmUtcmVuZGVyIHdoZW4gcmVjZWl2aW5nIHRoZSBnaXZlbiBgcHJvcHNgIGFuZCBgc3RhdGVgLlxuXHQgKlx0QHBhcmFtIHtvYmplY3R9IG5leHRQcm9wc1xuXHQgKlx0QHBhcmFtIHtvYmplY3R9IG5leHRTdGF0ZVxuXHQgKlx0QHBhcmFtIHtvYmplY3R9IG5leHRDb250ZXh0XG5cdCAqXHRAcmV0dXJucyB7Qm9vbGVhbn0gc2hvdWxkIHRoZSBjb21wb25lbnQgcmUtcmVuZGVyXG5cdCAqXHRAbmFtZSBzaG91bGRDb21wb25lbnRVcGRhdGVcblx0ICpcdEBmdW5jdGlvblxuXHQgKi9cblxuXG5cdC8qKiBVcGRhdGUgY29tcG9uZW50IHN0YXRlIGJ5IGNvcHlpbmcgcHJvcGVydGllcyBmcm9tIGBzdGF0ZWAgdG8gYHRoaXMuc3RhdGVgLlxuXHQgKlx0QHBhcmFtIHtvYmplY3R9IHN0YXRlXHRcdEEgaGFzaCBvZiBzdGF0ZSBwcm9wZXJ0aWVzIHRvIHVwZGF0ZSB3aXRoIG5ldyB2YWx1ZXNcblx0ICpcdEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXHRBIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCBvbmNlIGNvbXBvbmVudCBzdGF0ZSBpcyB1cGRhdGVkXG5cdCAqL1xuXHRzZXRTdGF0ZShzdGF0ZSwgY2FsbGJhY2spIHtcblx0XHRsZXQgcyA9IHRoaXMuc3RhdGU7XG5cdFx0aWYgKCF0aGlzLnByZXZTdGF0ZSkgdGhpcy5wcmV2U3RhdGUgPSBleHRlbmQoe30sIHMpO1xuXHRcdGV4dGVuZChzLCB0eXBlb2Ygc3RhdGU9PT0nZnVuY3Rpb24nID8gc3RhdGUocywgdGhpcy5wcm9wcykgOiBzdGF0ZSk7XG5cdFx0aWYgKGNhbGxiYWNrKSAodGhpcy5fcmVuZGVyQ2FsbGJhY2tzID0gKHRoaXMuX3JlbmRlckNhbGxiYWNrcyB8fCBbXSkpLnB1c2goY2FsbGJhY2spO1xuXHRcdGVucXVldWVSZW5kZXIodGhpcyk7XG5cdH0sXG5cblxuXHQvKiogSW1tZWRpYXRlbHkgcGVyZm9ybSBhIHN5bmNocm9ub3VzIHJlLXJlbmRlciBvZiB0aGUgY29tcG9uZW50LlxuXHQgKlx0QHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2tcdFx0QSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgYWZ0ZXIgY29tcG9uZW50IGlzIHJlLXJlbmRlcmVkLlxuXHQgKlx0QHByaXZhdGVcblx0ICovXG5cdGZvcmNlVXBkYXRlKGNhbGxiYWNrKSB7XG5cdFx0aWYgKGNhbGxiYWNrKSAodGhpcy5fcmVuZGVyQ2FsbGJhY2tzID0gKHRoaXMuX3JlbmRlckNhbGxiYWNrcyB8fCBbXSkpLnB1c2goY2FsbGJhY2spO1xuXHRcdHJlbmRlckNvbXBvbmVudCh0aGlzLCBGT1JDRV9SRU5ERVIpO1xuXHR9LFxuXG5cblx0LyoqIEFjY2VwdHMgYHByb3BzYCBhbmQgYHN0YXRlYCwgYW5kIHJldHVybnMgYSBuZXcgVmlydHVhbCBET00gdHJlZSB0byBidWlsZC5cblx0ICpcdFZpcnR1YWwgRE9NIGlzIGdlbmVyYWxseSBjb25zdHJ1Y3RlZCB2aWEgW0pTWF0oaHR0cDovL2phc29uZm9ybWF0LmNvbS93dGYtaXMtanN4KS5cblx0ICpcdEBwYXJhbSB7b2JqZWN0fSBwcm9wc1x0XHRQcm9wcyAoZWc6IEpTWCBhdHRyaWJ1dGVzKSByZWNlaXZlZCBmcm9tIHBhcmVudCBlbGVtZW50L2NvbXBvbmVudFxuXHQgKlx0QHBhcmFtIHtvYmplY3R9IHN0YXRlXHRcdFRoZSBjb21wb25lbnQncyBjdXJyZW50IHN0YXRlXG5cdCAqXHRAcGFyYW0ge29iamVjdH0gY29udGV4dFx0XHRDb250ZXh0IG9iamVjdCAoaWYgYSBwYXJlbnQgY29tcG9uZW50IGhhcyBwcm92aWRlZCBjb250ZXh0KVxuXHQgKlx0QHJldHVybnMgVk5vZGVcblx0ICovXG5cdHJlbmRlcigpIHt9XG5cbn0pO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4uL3NyYy9jb21wb25lbnQuanMiLCJpbXBvcnQgeyBkaWZmIH0gZnJvbSAnLi92ZG9tL2RpZmYnO1xuXG4vKiogUmVuZGVyIEpTWCBpbnRvIGEgYHBhcmVudGAgRWxlbWVudC5cbiAqXHRAcGFyYW0ge1ZOb2RlfSB2bm9kZVx0XHRBIChKU1gpIFZOb2RlIHRvIHJlbmRlclxuICpcdEBwYXJhbSB7RWxlbWVudH0gcGFyZW50XHRcdERPTSBlbGVtZW50IHRvIHJlbmRlciBpbnRvXG4gKlx0QHBhcmFtIHtFbGVtZW50fSBbbWVyZ2VdXHRBdHRlbXB0IHRvIHJlLXVzZSBhbiBleGlzdGluZyBET00gdHJlZSByb290ZWQgYXQgYG1lcmdlYFxuICpcdEBwdWJsaWNcbiAqXG4gKlx0QGV4YW1wbGVcbiAqXHQvLyByZW5kZXIgYSBkaXYgaW50byA8Ym9keT46XG4gKlx0cmVuZGVyKDxkaXYgaWQ9XCJoZWxsb1wiPmhlbGxvITwvZGl2PiwgZG9jdW1lbnQuYm9keSk7XG4gKlxuICpcdEBleGFtcGxlXG4gKlx0Ly8gcmVuZGVyIGEgXCJUaGluZ1wiIGNvbXBvbmVudCBpbnRvICNmb286XG4gKlx0Y29uc3QgVGhpbmcgPSAoeyBuYW1lIH0pID0+IDxzcGFuPnsgbmFtZSB9PC9zcGFuPjtcbiAqXHRyZW5kZXIoPFRoaW5nIG5hbWU9XCJvbmVcIiAvPiwgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2ZvbycpKTtcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlcih2bm9kZSwgcGFyZW50LCBtZXJnZSkge1xuXHRyZXR1cm4gZGlmZihtZXJnZSwgdm5vZGUsIHt9LCBmYWxzZSwgcGFyZW50LCBmYWxzZSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi4vc3JjL3JlbmRlci5qcyIsImltcG9ydCB7IGgsIGggYXMgY3JlYXRlRWxlbWVudCB9IGZyb20gJy4vaCc7XG5pbXBvcnQgeyBjbG9uZUVsZW1lbnQgfSBmcm9tICcuL2Nsb25lLWVsZW1lbnQnO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnQnO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAnLi9yZW5kZXInO1xuaW1wb3J0IHsgcmVyZW5kZXIgfSBmcm9tICcuL3JlbmRlci1xdWV1ZSc7XG5pbXBvcnQgb3B0aW9ucyBmcm9tICcuL29wdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cdGgsXG5cdGNyZWF0ZUVsZW1lbnQsXG5cdGNsb25lRWxlbWVudCxcblx0Q29tcG9uZW50LFxuXHRyZW5kZXIsXG5cdHJlcmVuZGVyLFxuXHRvcHRpb25zXG59O1xuXG5leHBvcnQge1xuXHRoLFxuXHRjcmVhdGVFbGVtZW50LFxuXHRjbG9uZUVsZW1lbnQsXG5cdENvbXBvbmVudCxcblx0cmVuZGVyLFxuXHRyZXJlbmRlcixcblx0b3B0aW9uc1xufTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuLi9zcmMvcHJlYWN0LmpzIl0sIm1hcHBpbmdzIjoiOztBQUNBO0FDWUE7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBS0E7QUFFQTtBQU1BO0FBVUE7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7O0FDdERBO0FBQ0E7QUFBQTs7QUNGQTtBQUNBOztBQ0lBOzs7O0FDSEE7QUFFQTtBQUNBOztBQVdBOzs7O0FDTEE7QUFDQTs7Ozs7OztBQXdCQTs7QUFTQTs7Ozs7QUN0Q0E7QUFDQTs7Ozs7OztBQXNCQTtBQUlBO0FBR0E7QUFDQTtBQU9BOztBQUlBO0FBQ0E7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFHQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQTs7O0FBY0E7QUFFQTtBQUVBO0FBQ0E7O0FBT0E7QUFDQTs7OztBQ2pGQTs7Ozs7QUFZQTs7Ozs7O0FBYUE7QUFHQTtBQUNBO0FBRUE7O0FBR0E7O0FBSUE7QUFFQTtBQUdBOztBQU9BOzs7QUFPQTs7O0FBR0E7OztBQUtBO0FBRUE7O0FBSUE7QUFLQTs7QUFLQTtBQUVBOzs7Ozs7QUFnQkE7QUFHQTtBQUNBO0FBTUE7QUFLQTs7OztBQWlCQTtBQVVBO0FBTUE7QUFFQTtBQUNBO0FBQUE7O0FBR0E7O0FBS0E7QUFFQTtBQUVBO0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBSUE7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQU1BO0FBRUE7O0FBZ0JBOzs7QUFpQkE7QUFDQTtBQUNBOztBQVNBO0FBS0E7OztBQVNBO0FBQ0E7QUFDQTs7Ozs7O0FBWUE7QUFDQTs7QUFhQTs7Ozs7OztBQ3hSQTtBQUVBO0FBQ0E7Ozs7QUFJQTtBQUNBOztBQUdBO0FBSUE7QUFDQTtBQUNBOztBQUtBOztBQUlBO0FBQ0E7Ozs7Ozs7OztBQ3RCQTtBQUlBO0FBQ0E7OztBQUtBO0FBQ0E7O0FBSUE7Ozs7QUFtQkE7O0FBZUE7QUFLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0E7QUFDQTtBQUNBOztBQUtBO0FBQ0E7QUFHQTtBQUNBO0FBR0E7QUFLQTs7QUFNQTs7QUFHQTtBQUVBOztBQUdBO0FBQ0E7O0FBRUE7O0FBSUE7O0FBRUE7QUFHQTtBQUNBO0FBS0E7QUFDQTs7OztBQUtBO0FBQ0E7O0FBRUE7QUFFQTtBQUNBO0FBQ0E7Ozs7QUFLQTtBQUlBO0FBQ0E7QUFDQTtBQUdBO0FBRUE7Ozs7QUFLQTtBQUtBO0FBRUE7QUFHQTs7QUFLQTtBQUdBOzs7QUFVQTs7O0FBWUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBR0E7O0FBRUE7QUFDQTtBQUVBO0FBQ0E7QUFDQTs7Ozs7O0FBYUE7Ozs7QUFTQTtBQUdBO0FBRUE7QUFFQTtBQUVBOztBQUdBO0FBRUE7Ozs7Ozs7Ozs7Ozs7QUMvUEE7QVZBQTtBQUVBOztBR0RBOzs7O0FJSUE7Ozs7Ozs7Ozs7QUk4Q0E7QUFDQTtBQUNBOztBQVdBOzs7Ozs7O0FDbkRBO0FBQ0E7OztBQ1ZBOzsiLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar _preact = __webpack_require__(0);\n\nvar _App = __webpack_require__(2);\n\nvar App = _interopRequireWildcard(_App);\n\nfunction _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }\n\nvar root = void 0;\nfunction init() {\n\troot = (0, _preact.render)((0, _preact.h)(App.default, null), document.body, root);\n}\n\nif (true) {\n\t//require('preact/devtools');   // turn this on if you want to enable React DevTools!  \n\tmodule.hot.accept(4, function () {\n\t\treturn requestAnimationFrame(init);\n\t});\n}\n\nconsole.log('loaded!');\ninit();//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMS5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9jbGllbnQvYXBwLmpzP2IyNDUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaCwgcmVuZGVyfSBmcm9tICdwcmVhY3QnO1xyXG5pbXBvcnQgKiBhcyBBcHAgZnJvbSAnY2xpZW50L0FwcC5qc3gnO1xyXG5cclxuXHJcbmxldCByb290O1xyXG5mdW5jdGlvbiBpbml0KCkge1xyXG4gIHJvb3QgPSByZW5kZXIoPEFwcC5kZWZhdWx0IC8+LCBkb2N1bWVudC5ib2R5LCByb290KTtcclxufVxyXG5cclxuaWYgKG1vZHVsZS5ob3QpIHtcclxuXHQvL3JlcXVpcmUoJ3ByZWFjdC9kZXZ0b29scycpOyAgIC8vIHR1cm4gdGhpcyBvbiBpZiB5b3Ugd2FudCB0byBlbmFibGUgUmVhY3QgRGV2VG9vbHMhICBcclxuXHRtb2R1bGUuaG90LmFjY2VwdCgnY2xpZW50L2FwcCcsICgpID0+IHJlcXVlc3RBbmltYXRpb25GcmFtZShpbml0KSApO1xyXG59XHJcblxyXG5jb25zb2xlLmxvZygnbG9hZGVkIScpO1xyXG5pbml0KCk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGNsaWVudC9hcHAuanMiXSwibWFwcGluZ3MiOiI7O0FBQUE7QUFDQTtBQUFBO0FBQ0E7QUFEQTtBQUNBOzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlUm9vdCI6IiJ9");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nexports.__esModule = true;\nexports.default = undefined;\n\nvar _preact = __webpack_require__(0);\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError(\"this hasn't been initialised - super() hasn't been called\"); } return call && (typeof call === \"object\" || typeof call === \"function\") ? call : self; }\n\nfunction _inherits(subClass, superClass) { if (typeof superClass !== \"function\" && superClass !== null) { throw new TypeError(\"Super expression must either be null or a function, not \" + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }\n\nvar App = function (_Component) {\n  _inherits(App, _Component);\n\n  function App() {\n    _classCallCheck(this, App);\n\n    return _possibleConstructorReturn(this, _Component.apply(this, arguments));\n  }\n\n  App.prototype.render = function render() {\n    return (0, _preact.h)(\n      'div',\n      null,\n      'This is the app loading... hot swapings...'\n    );\n  };\n\n  return App;\n}(_preact.Component);\n\nexports.default = App;\n;//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiMi5qcyIsInNvdXJjZXMiOlsid2VicGFjazovLy9jbGllbnQvQXBwLmpzeD80Y2NkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGgsIENvbXBvbmVudCB9IGZyb20gJ3ByZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHAgZXh0ZW5kcyBDb21wb25lbnQge1xyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIDxkaXY+XHJcbiAgICAgICAgVGhpcyBpcyB0aGUgYXBwIGxvYWRpbmcuLi5cclxuICAgICAgICBob3Qgc3dhcGluZ3MuLi5cclxuICAgICAgPC9kaXY+XHJcbiAgICApO1xyXG4gIH1cclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGNsaWVudC9BcHAuanN4Il0sIm1hcHBpbmdzIjoiOzs7OztBQUFBO0FBQ0E7Ozs7Ozs7QUFDQTs7Ozs7Ozs7O0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBS0E7QUFDQTs7OztBQVRBO0FBU0EiLCJzb3VyY2VSb290IjoiIn0=");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ })
/******/ ]);