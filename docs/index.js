/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + chunkId + ".index.js"
/******/ 	}
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	function promiseResolve() { return Promise.resolve(); }
/******/
/******/ 	var wasmImportObjects = {
/******/ 		"./pkg/minimal_bg.wasm": function() {
/******/ 			return {
/******/ 				"./minimal": {
/******/ 					"__wbg_debug_c47d5c57dfbdeaec": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbg_debug_c47d5c57dfbdeaec"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_object_drop_ref": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_object_drop_ref"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_Math_atan2": function(p0f64,p1f64) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_Math_atan2"](p0f64,p1f64);
/******/ 					},
/******/ 					"__wbg_warn_320705b63b65bcdd": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbg_warn_320705b63b65bcdd"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_string_new": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_string_new"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_json_serialize": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_json_serialize"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_now_c2ee488afab5531a": function() {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbg_now_c2ee488afab5531a"]();
/******/ 					},
/******/ 					"__widl_instanceof_CanvasRenderingContext2D": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_instanceof_CanvasRenderingContext2D"](p0i32);
/******/ 					},
/******/ 					"__widl_f_begin_path_CanvasRenderingContext2D": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_begin_path_CanvasRenderingContext2D"](p0i32);
/******/ 					},
/******/ 					"__widl_f_stroke_CanvasRenderingContext2D": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_stroke_CanvasRenderingContext2D"](p0i32);
/******/ 					},
/******/ 					"__widl_f_set_fill_style_CanvasRenderingContext2D": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_set_fill_style_CanvasRenderingContext2D"](p0i32,p1i32);
/******/ 					},
/******/ 					"__widl_f_set_line_width_CanvasRenderingContext2D": function(p0i32,p1f64) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_set_line_width_CanvasRenderingContext2D"](p0i32,p1f64);
/******/ 					},
/******/ 					"__widl_f_rect_CanvasRenderingContext2D": function(p0i32,p1f64,p2f64,p3f64,p4f64) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_rect_CanvasRenderingContext2D"](p0i32,p1f64,p2f64,p3f64,p4f64);
/******/ 					},
/******/ 					"__widl_f_clear_rect_CanvasRenderingContext2D": function(p0i32,p1f64,p2f64,p3f64,p4f64) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_clear_rect_CanvasRenderingContext2D"](p0i32,p1f64,p2f64,p3f64,p4f64);
/******/ 					},
/******/ 					"__widl_f_fill_rect_CanvasRenderingContext2D": function(p0i32,p1f64,p2f64,p3f64,p4f64) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_fill_rect_CanvasRenderingContext2D"](p0i32,p1f64,p2f64,p3f64,p4f64);
/******/ 					},
/******/ 					"__widl_f_restore_CanvasRenderingContext2D": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_restore_CanvasRenderingContext2D"](p0i32);
/******/ 					},
/******/ 					"__widl_f_save_CanvasRenderingContext2D": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_save_CanvasRenderingContext2D"](p0i32);
/******/ 					},
/******/ 					"__widl_f_rotate_CanvasRenderingContext2D": function(p0i32,p1f64,p2i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_rotate_CanvasRenderingContext2D"](p0i32,p1f64,p2i32);
/******/ 					},
/******/ 					"__widl_f_scale_CanvasRenderingContext2D": function(p0i32,p1f64,p2f64,p3i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_scale_CanvasRenderingContext2D"](p0i32,p1f64,p2f64,p3i32);
/******/ 					},
/******/ 					"__widl_f_translate_CanvasRenderingContext2D": function(p0i32,p1f64,p2f64,p3i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_translate_CanvasRenderingContext2D"](p0i32,p1f64,p2f64,p3i32);
/******/ 					},
/******/ 					"__widl_f_get_context_HTMLCanvasElement": function(p0i32,p1i32,p2i32,p3i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_get_context_HTMLCanvasElement"](p0i32,p1i32,p2i32,p3i32);
/******/ 					},
/******/ 					"__widl_f_width_HTMLCanvasElement": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_width_HTMLCanvasElement"](p0i32);
/******/ 					},
/******/ 					"__widl_f_height_HTMLCanvasElement": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_height_HTMLCanvasElement"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_number_get": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_number_get"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_string_get": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_string_get"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_boolean_get": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_boolean_get"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_is_null": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_is_null"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_is_undefined": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_is_undefined"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_is_symbol": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_is_symbol"](p0i32);
/******/ 					},
/******/ 					"__wbindgen_throw": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_throw"](p0i32,p1i32);
/******/ 					}
/******/ 				}
/******/ 			};
/******/ 		},
/******/ 	};
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
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var head = document.getElementsByTagName('head')[0];
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							var error = new Error('Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')');
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				head.appendChild(script);
/******/ 			}
/******/ 		}
/******/
/******/ 		// Fetch + compile chunk loading for webassembly
/******/
/******/ 		var wasmModules = {"0":["./pkg/minimal_bg.wasm"]}[chunkId] || [];
/******/
/******/ 		wasmModules.forEach(function(wasmModuleId) {
/******/ 			var installedWasmModuleData = installedWasmModules[wasmModuleId];
/******/
/******/ 			// a Promise means "currently loading" or "already loaded".
/******/ 			if(installedWasmModuleData)
/******/ 				promises.push(installedWasmModuleData);
/******/ 			else {
/******/ 				var importObject = wasmImportObjects[wasmModuleId]();
/******/ 				var req = fetch(__webpack_require__.p + "" + {"./pkg/minimal_bg.wasm":"30d0f486a34499c5fbcb"}[wasmModuleId] + ".module.wasm");
/******/ 				var promise;
/******/ 				if(importObject instanceof Promise && typeof WebAssembly.compileStreaming === 'function') {
/******/ 					promise = Promise.all([WebAssembly.compileStreaming(req), importObject]).then(function(items) {
/******/ 						return WebAssembly.instantiate(items[0], items[1]);
/******/ 					});
/******/ 				} else if(typeof WebAssembly.instantiateStreaming === 'function') {
/******/ 					promise = WebAssembly.instantiateStreaming(req, importObject);
/******/ 				} else {
/******/ 					var bytesPromise = req.then(function(x) { return x.arrayBuffer(); });
/******/ 					promise = bytesPromise.then(function(bytes) {
/******/ 						return WebAssembly.instantiate(bytes, importObject);
/******/ 					});
/******/ 				}
/******/ 				promises.push(installedWasmModules[wasmModuleId] = promise.then(function(res) {
/******/ 					return __webpack_require__.w[wasmModuleId] = (res.instance || res).exports;
/******/ 				}));
/******/ 			}
/******/ 		});
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	// object with all WebAssembly.instance exports
/******/ 	__webpack_require__.w = {};
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./gamepad.js":
/*!********************!*\
  !*** ./gamepad.js ***!
  \********************/
/*! exports provided: controllers, scangamepads, initGamePad, gamepadNormalize */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"controllers\", function() { return controllers; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"scangamepads\", function() { return scangamepads; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initGamePad\", function() { return initGamePad; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"gamepadNormalize\", function() { return gamepadNormalize; });\nconst controllers = {};\nconst haveEvents = 'ongamepadconnected' in window;\n\nfunction scangamepads() {\n    var gamepads = navigator.getGamepads\n        ? navigator.getGamepads()\n        : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);\n    for (var i = 0; i < gamepads.length; i++) {\n        if (gamepads[i]) {\n            if (gamepads[i].index in controllers) {\n                controllers[gamepads[i].index] = gamepads[i];\n            } else {\n                addgamepad(gamepads[i]);\n            }\n        }\n    }\n}\n\nfunction initGamePad(debugGamePad = false) {\n\n    function connecthandler(e) {\n        addgamepad(e.gamepad);\n    }\n\n    function addgamepad(gamepad) {\n        controllers[gamepad.index] = gamepad;\n        if (debugGamePad) addGamePad(gamepad);\n    }\n\n    function disconnecthandler(e) {\n        removegamepad(e.gamepad);\n    }\n\n    function removegamepad(gamepad) {\n        if (debugGamePad) debug.removeGamePad(gamepad);\n        delete controllers[gamepad.index];\n    }\n\n    window.addEventListener(\"gamepadconnected\", connecthandler);\n    window.addEventListener(\"gamepaddisconnected\", disconnecthandler);\n\n    if (!'ongamepadconnected' in window) {\n        setInterval(scangamepads, 500);\n    }\n};\n\nfunction gamepadNormalize(gamePad) {\n    let hori1, vert1, l2, hori2, vert2, r2, hori3, vert3;\n    // gilberts linux laptop\n    if (gamePad.axes.length === 8) {\n        [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = gamePad.axes;\n    }\n    // hendriks mac book\n    else if (gamePad.axes.length === 4) {\n        const { axes, buttons } = gamePad;\n        [ hori1, vert1, hori2, vert2 ] = axes;\n        const btn = (i) => gamepadButton(buttons[i]);\n        l2 = btn(6);\n        r2 = btn(7);\n        hori3 = -btn(14) + btn(15);\n        vert3 = -btn(12) + btn(13);\n    }\n    // don't know yet\n    else console.error(\"I don't know this game pad mapping.\");\n    const arr = [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ];\n    return arr.map((x) => x * x > 0.01 ? x : 0);\n}\n\n// I hope only 'val' is needed, not 'pressed'\nfunction gamepadButton(val) {\n    // var pressed = val == 1.0;\n    if (typeof (val) == \"object\") {\n        // pressed = val.pressed;\n        val = val.value;\n    }\n    return val;\n}\n\n\nfunction addGamePad(gamepad) {\n    var d = document.createElement(\"div\");\n    d.setAttribute(\"id\", \"controller\" + gamepad.index);\n\n    var t = document.createElement(\"h1\");\n    t.appendChild(document.createTextNode(\"gamepad: \" + gamepad.id));\n    d.appendChild(t);\n\n    var b = document.createElement(\"div\");\n    b.className = \"buttons\";\n    for (var i = 0; i < gamepad.buttons.length; i++) {\n        var e = document.createElement(\"span\");\n        e.className = \"button\";\n        //e.id = \"b\" + i;\n        e.innerHTML = i;\n        b.appendChild(e);\n    }\n\n    d.appendChild(b);\n\n    var a = document.createElement(\"div\");\n    a.className = \"axes\";\n\n    for (var i = 0; i < gamepad.axes.length; i++) {\n        var p = document.createElement(\"progress\");\n        p.className = \"axis\";\n        //p.id = \"a\" + i;\n        p.setAttribute(\"max\", \"2\");\n        p.setAttribute(\"value\", \"1\");\n        p.innerHTML = i;\n        a.appendChild(p);\n    }\n\n    d.appendChild(a);\n\n    // See https://github.com/luser/gamepadtest/blob/master/index.html\n    var start = document.getElementById(\"start\");\n    if (start) {\n        start.style.display = \"none\";\n    }\n\n    document.body.appendChild(d);\n    requestAnimationFrame(updateGamePad);\n}\n\nfunction updateGamePad() {\n    if (!haveEvents) {\n        scangamepads();\n    }\n\n    var i = 0;\n    var j;\n\n    for (j in controllers) {\n        var controller = controllers[j];\n        var d = document.getElementById(\"controller\" + j);\n        var buttons = d.getElementsByClassName(\"button\");\n\n        for (i = 0; i < controller.buttons.length; i++) {\n            var b = buttons[i];\n            var val = controller.buttons[i];\n            var pressed = val == 1.0;\n            if (typeof (val) == \"object\") {\n                pressed = val.pressed;\n                val = val.value;\n            }\n\n            var pct = Math.round(val * 100) + \"%\";\n            b.style.backgroundSize = pct + \" \" + pct;\n\n            if (pressed) {\n                b.style.backgroundColor = \"orange\";\n            } else {\n                b.style.backgroundColor = \"white\";\n            }\n        }\n\n        var axes = d.getElementsByClassName(\"axis\");\n        for (i = 0; i < controller.axes.length; i++) {\n            var a = axes[i];\n            a.innerHTML = i + \": \" + controller.axes[i].toFixed(4);\n            a.setAttribute(\"value\", controller.axes[i] + 1);\n        }\n    }\n\n    requestAnimationFrame(updateGamePad);\n}\n\nfunction removeGamePad(gamepad) {\n    var d = document.getElementById(\"controller\" + gamepad.index);\n    document.body.removeChild(d);\n}\n\n\n//# sourceURL=webpack:///./gamepad.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gamepad__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gamepad */ \"./gamepad.js\");\n\n\nconst DEBUG_GAME_PAD = !true;\n\nwindow.viewConfig = {x: 0, y: 300, rotation: 0, zoom: 0.7};\n\nvoid async function main() {\n    const wasm = await __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./pkg */ \"./pkg/minimal.js\"));\n\n    Object(_gamepad__WEBPACK_IMPORTED_MODULE_0__[\"initGamePad\"])(DEBUG_GAME_PAD);\n\n    const canvas = document.createElement('canvas');\n    canvas.style.border = \"1px solid black\";\n    const [width, height] = [800, 800];\n    canvas.width = width;\n    canvas.height = height;\n\n    document.body.appendChild(canvas);\n\n    const game = new wasm.Game(canvas, { width, height });\n    window.game = game;\n\n    const margin = 0.00000000001;\n    game.set_scene({\n        margin,\n        gravity: 9.81,\n        box_radx: 0.15 - margin,\n        box_rady: 0.09 - margin,\n        ground_radx: 125 - margin,\n        ground_rady: 1 - margin,\n        ground_x: 0,\n        ground_y: 9,\n        f1: 1,\n        f2: 2,\n\n        buildings: [\n            {x: 0.2, w: 5, h: 17},\n            {x: 2.2, w: 5, h: 18},\n            {x: 7.3, w: 5, h: 34},\n            {x: 8.9, w: 5, h: 31},\n            {x: 10.5, w: 6, h: 35},\n            // {x: 8.2, w: 8, h: 69},\n        ],\n\n        player_a: {x: 1.3, y: 3.9, radx: 0.2, rady: 0.3},\n        player_b: {x: 7.8,   y: 1.4, radx: 0.2, rady: 0.3},\n\n        first_shot: {\n            x: 1.3,\n            y: 3,\n            rot: Math.PI * 1.6,\n            power: 10,\n            config: {\n                w: 0.1,\n                h: 0.4,\n                inertia: 3,\n            }\n        }\n    });\n\n    const loop = () => {\n        const gamePad = _gamepad__WEBPACK_IMPORTED_MODULE_0__[\"controllers\"][0];\n        if (gamePad) {\n            const input = Object(_gamepad__WEBPACK_IMPORTED_MODULE_0__[\"gamepadNormalize\"])(gamePad);\n            const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = input;\n            window.viewConfig.x -= hori1 * 8;\n            window.viewConfig.y -= vert1 * 8;\n            //window.viewConfig.rotation = Math.atan2(vert2, hori2);\n            window.viewConfig.zoom += 0.01 * (-l2 + r2);\n            Object(_gamepad__WEBPACK_IMPORTED_MODULE_0__[\"scangamepads\"])();\n        }\n\n        game.step();\n        game.render_scene(viewConfig);\n        requestAnimationFrame(loop);\n    }\n    loop();\n}()\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });