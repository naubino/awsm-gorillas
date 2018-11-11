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
/******/ 					"__wbindgen_json_parse": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_json_parse"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_json_serialize": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_json_serialize"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_debug_c47d5c57dfbdeaec": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbg_debug_c47d5c57dfbdeaec"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_object_drop_ref": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_object_drop_ref"](p0i32);
/******/ 					},
/******/ 					"__wbg_warn_320705b63b65bcdd": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbg_warn_320705b63b65bcdd"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbindgen_string_new": function(p0i32,p1i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbindgen_string_new"](p0i32,p1i32);
/******/ 					},
/******/ 					"__wbg_now_c2ee488afab5531a": function() {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__wbg_now_c2ee488afab5531a"]();
/******/ 					},
/******/ 					"__widl_instanceof_CanvasRenderingContext2D": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_instanceof_CanvasRenderingContext2D"](p0i32);
/******/ 					},
/******/ 					"__widl_f_draw_image_with_html_image_element_and_dw_and_dh_CanvasRenderingContext2D": function(p0i32,p1i32,p2f64,p3f64,p4f64,p5f64,p6i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_draw_image_with_html_image_element_and_dw_and_dh_CanvasRenderingContext2D"](p0i32,p1i32,p2f64,p3f64,p4f64,p5f64,p6i32);
/******/ 					},
/******/ 					"__widl_f_begin_path_CanvasRenderingContext2D": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_begin_path_CanvasRenderingContext2D"](p0i32);
/******/ 					},
/******/ 					"__widl_f_fill_CanvasRenderingContext2D": function(p0i32) {
/******/ 						return installedModules["./pkg/minimal.js"].exports["__widl_f_fill_CanvasRenderingContext2D"](p0i32);
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
/******/ 				var req = fetch(__webpack_require__.p + "" + {"./pkg/minimal_bg.wasm":"f129b5c37ec174a6990f"}[wasmModuleId] + ".module.wasm");
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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"controllers\", function() { return controllers; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"scangamepads\", function() { return scangamepads; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initGamePad\", function() { return initGamePad; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"gamepadNormalize\", function() { return gamepadNormalize; });\nconst controllers = {};\nconst haveEvents = 'ongamepadconnected' in window;\n\nfunction scangamepads() {\n    var gamepads = navigator.getGamepads\n        ? navigator.getGamepads()\n        : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads() : []);\n    for (var i = 0; i < gamepads.length; i++) {\n        if (gamepads[i]) {\n            if (gamepads[i].index in controllers) {\n                controllers[gamepads[i].index] = gamepads[i];\n            } else {\n                addgamepad(gamepads[i]);\n            }\n        }\n    }\n}\n\nfunction connecthandler(e) {\n    addgamepad(e.gamepad);\n}\n\nfunction addgamepad(gamepad) {\n    controllers[gamepad.index] = gamepad;\n    if (debugGamePad) addGamePad(gamepad);\n}\n\nfunction disconnecthandler(e) {\n    removegamepad(e.gamepad);\n}\n\nfunction removegamepad(gamepad) {\n    if (debugGamePad) debug.removeGamePad(gamepad);\n    delete controllers[gamepad.index];\n}\n\nlet debugGamePad = false;\n\nfunction initGamePad(_debugGamePad = false) {\n    debugGamePad = _debugGamePad;\n\n    window.addEventListener(\"gamepadconnected\", connecthandler);\n    window.addEventListener(\"gamepaddisconnected\", disconnecthandler);\n\n    if (!'ongamepadconnected' in window) {\n        setInterval(scangamepads, 500);\n    }\n};\n\nfunction gamepadNormalize(gamePad) {\n    let hori1, vert1, l2, hori2, vert2, r2, hori3, vert3;\n    // gilberts linux laptop\n    if (gamePad.axes.length === 8) {\n        [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = gamePad.axes;\n    }\n    // hendriks mac book\n    else if (gamePad.axes.length === 4) {\n        const { axes, buttons } = gamePad;\n        [ hori1, vert1, hori2, vert2 ] = axes;\n        const btn = (i) => gamepadButton(buttons[i]);\n        l2 = btn(6);\n        r2 = btn(7);\n        hori3 = -btn(14) + btn(15);\n        vert3 = -btn(12) + btn(13);\n    }\n    // don't know yet\n    else console.error(\"I don't know this game pad mapping.\");\n    const arr = [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ];\n    return arr.map((x) => x * x > 0.01 ? x : 0);\n}\n\n// I hope only 'val' is needed, not 'pressed'\nfunction gamepadButton(val) {\n    // var pressed = val == 1.0;\n    if (typeof (val) == \"object\") {\n        // pressed = val.pressed;\n        val = val.value;\n    }\n    return val;\n}\n\n\nfunction addGamePad(gamepad) {\n    var d = document.createElement(\"div\");\n    d.setAttribute(\"id\", \"controller\" + gamepad.index);\n\n    var t = document.createElement(\"h1\");\n    t.appendChild(document.createTextNode(\"gamepad: \" + gamepad.id));\n    d.appendChild(t);\n\n    var b = document.createElement(\"div\");\n    b.className = \"buttons\";\n    for (var i = 0; i < gamepad.buttons.length; i++) {\n        var e = document.createElement(\"span\");\n        e.className = \"button\";\n        //e.id = \"b\" + i;\n        e.innerHTML = i;\n        b.appendChild(e);\n    }\n\n    d.appendChild(b);\n\n    var a = document.createElement(\"div\");\n    a.className = \"axes\";\n\n    for (var i = 0; i < gamepad.axes.length; i++) {\n        var p = document.createElement(\"progress\");\n        p.className = \"axis\";\n        //p.id = \"a\" + i;\n        p.setAttribute(\"max\", \"2\");\n        p.setAttribute(\"value\", \"1\");\n        p.innerHTML = i;\n        a.appendChild(p);\n    }\n\n    d.appendChild(a);\n\n    // See https://github.com/luser/gamepadtest/blob/master/index.html\n    var start = document.getElementById(\"start\");\n    if (start) {\n        start.style.display = \"none\";\n    }\n\n    document.body.appendChild(d);\n    requestAnimationFrame(updateGamePad);\n}\n\nfunction updateGamePad() {\n    if (!haveEvents) {\n        scangamepads();\n    }\n\n    var i = 0;\n    var j;\n\n    for (j in controllers) {\n        var controller = controllers[j];\n        var d = document.getElementById(\"controller\" + j);\n        var buttons = d.getElementsByClassName(\"button\");\n\n        for (i = 0; i < controller.buttons.length; i++) {\n            var b = buttons[i];\n            var val = controller.buttons[i];\n            var pressed = val == 1.0;\n            if (typeof (val) == \"object\") {\n                pressed = val.pressed;\n                val = val.value;\n            }\n\n            var pct = Math.round(val * 100) + \"%\";\n            b.style.backgroundSize = pct + \" \" + pct;\n\n            if (pressed) {\n                b.style.backgroundColor = \"orange\";\n            } else {\n                b.style.backgroundColor = \"white\";\n            }\n        }\n\n        var axes = d.getElementsByClassName(\"axis\");\n        for (i = 0; i < controller.axes.length; i++) {\n            var a = axes[i];\n            a.innerHTML = i + \": \" + controller.axes[i].toFixed(4);\n            a.setAttribute(\"value\", controller.axes[i] + 1);\n        }\n    }\n\n    requestAnimationFrame(updateGamePad);\n}\n\nfunction removeGamePad(gamepad) {\n    var d = document.getElementById(\"controller\" + gamepad.index);\n    document.body.removeChild(d);\n}\n\n\n//# sourceURL=webpack:///./gamepad.js?");

/***/ }),

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _gamepad__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./gamepad */ \"./gamepad.js\");\n\n\nconst DEBUG_GAME_PAD = !true;\n\nwindow.viewConfig = {x: 0, y: 0.6, rotation: 0, zoom: 50.0};\n\nconst style = [ '#04aaac', '#ac0204', '#acaaac', '#aa04ac', '#aaac04' ]\nconst selectedLevel = 2;\nconst levels = [\n    {\n    buildings: [\n        { x: -9.6, w: 5, h: 15, fill_style: style[2] },\n        { x: -7.3, w: 5, h: 30, fill_style: style[1] },\n        { x: -4.6, w: 7, h: 40, fill_style: style[4] },\n\n        { x: 4.6, w: 7, h: 40, fill_style: style[3] },\n        { x: 7.3, w: 5, h: 30, fill_style: style[0] },\n        { x: 9.6, w: 5, h: 15, fill_style: style[2] },\n    ],\n\n    player_a: { x: -7.3, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },\n    player_b: { x: 7.3, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },\n},\n    {\n    buildings: [\n        { x: -7.0, w: 7, h: 40, fill_style: style[0] },\n        { x: -4.3, w: 5, h: 25, fill_style: style[1] },\n        { x: -2.0, w: 5, h: 15, fill_style: style[2] },\n\n        { x: 2.0, w: 5, h: 15, fill_style: style[4] },\n        { x: 4.3, w: 5, h: 25, fill_style: style[0] },\n        { x: 7.0, w: 7, h: 40, fill_style: style[3] },\n    ],\n\n    player_a: { x: -7.0, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },\n    player_b: { x: 7.0, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },\n},\n{\n    buildings: [\n        { x: -7.0, w: 5, h: 21, fill_style: style[0] },\n        { x: -4.6, w: 3, h: 12, fill_style: style[1] },\n        { x: -3.0, w: 3, h: 15, fill_style: style[2] },\n\n        { x: 0.0, w: 7, h: 38, fill_style: style[3] },\n\n        { x: 3.0, w: 3, h: 15, fill_style: style[4] },\n        { x: 4.6, w: 3, h: 12, fill_style: style[1] },\n        { x: 7.0, w: 5, h: 21, fill_style: style[0] },\n    ],\n    player_a: { x: -7.0, y: -1.0, radx: 0.2, rady: 0.3, inertia: 0.1 },\n    player_b: { x: 7.0, y: -1.0, radx: 0.2, rady: 0.3, inertia: 0.1 },\n},\n(() => {\n\n    const leftBuildings = [\n        { x: -1.6, w: 5, h: 45, fill_style: style[2] },\n        { x: -9.6, w: 5, h: 15, fill_style: style[2] },\n        { x: -7.3, w: 5, h: 30, fill_style: style[1] },\n        { x: -4.6, w: 7, h: 40, fill_style: style[4] },\n    ];\n\n    const rightBuildings = leftBuildings.map(building => ({\n        ...building,\n        x: -building.x,\n    }));\n\n\n    return {\n        buildings: [\n            ...leftBuildings,\n            ... rightBuildings\n        ],\n\n        player_a: { x: -7.3, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },\n        player_b: { x: 7.3, y: -4.0, radx: 0.2, rady: 0.3, inertia: 0.5 },\n    };\n})()\n];\n\n\nconst shotConfigs = {\n    light: {\n        w: 0.2,\n        h: 0.08,\n        inertia: 0.8,\n        ttl: 10,\n        cost: 0.1,\n    },\n    medium: {\n        w: 0.3,\n        h: 0.1,\n        inertia: 1,\n        ttl: 10,\n        cost: 0.3,\n    },\n    heavy: {\n        w: 0.6,\n        h: 0.2,\n        inertia: 1,\n        ttl: 10,\n        cost: 3.0,\n    }\n};\n\nvoid async function main() {\n    const wasm = await __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./pkg */ \"./pkg/minimal.js\"));\n\n    Object(_gamepad__WEBPACK_IMPORTED_MODULE_0__[\"initGamePad\"])(DEBUG_GAME_PAD);\n\n    const gorilla_img = document.createElement('img');\n    gorilla_img.src = \"gorilla.png\";\n    gorilla_img.id = \"gorilla-png\";\n\n    const canvas = document.createElement('canvas');\n    canvas.style.border = \"1px solid black\";\n    const [width, height] = [800, 500];\n    canvas.width = width;\n    canvas.height = height;\n    canvas.style.marginLeft  = \"auto\"\n    canvas.style.marginRight = \"auto\"\n    canvas.style.display = \"block\"\n\n    document.body.appendChild(canvas);\n\n    const integration_parameters = {\n        dt: 1.0 / 60.0,\n        erp: 0.2,\n        warmstart_coeff: 1.00,\n        restitution_velocity_threshold: 1.0,\n        allowed_linear_error: 0.0001,\n        allowed_angular_error: 0.0001,\n        max_linear_correction: 100.0,\n        max_angular_correction: 0.2,\n        max_stabilization_multiplier: 0.2,\n        max_velocity_iterations: 20,\n        max_position_iterations: 2,\n    };\n\n    const game = new wasm.Game(canvas, gorilla_img, { width, height, integration_parameters });\n    window.game = game;\n\n\n    const margin = 0.00000000001;\n    game.set_scene({\n        margin,\n        gravity: 9.81,\n        box_radx: 0.21 - margin,\n        box_rady: 0.10 - margin,\n        ground_radx: 125 - margin,\n        ground_rady: 4.5 ,\n        ground_x: 0,\n        ground_y: 9,\n        f1: 1,\n        f2: 2,\n\n        ... levels[selectedLevel % levels.length]\n    });\n\n    let last_time = + performance.now();\n\n    const loop = (timestamp) => {\n        try { Object(_gamepad__WEBPACK_IMPORTED_MODULE_0__[\"scangamepads\"])(); } catch {}\n\n        if (_gamepad__WEBPACK_IMPORTED_MODULE_0__[\"controllers\"][0]) controlPlayer(0, _gamepad__WEBPACK_IMPORTED_MODULE_0__[\"controllers\"][0], (btn) => shoot({game, playerIndex: 0}, btn));\n        if (_gamepad__WEBPACK_IMPORTED_MODULE_0__[\"controllers\"][1]) controlPlayer(1, _gamepad__WEBPACK_IMPORTED_MODULE_0__[\"controllers\"][1], (btn) => shoot({game, playerIndex: 1}, btn));\n\n        const dt = +timestamp - last_time;\n        last_time = +timestamp;\n\n        game.step(1 / 60);\n        game.render_scene(viewConfig);\n\n        requestAnimationFrame(loop);\n    }\n    loop();\n}()\n\n\nfunction controlPlayer(playerIndex, gamePad, shootCallback) {\n    const input = Object(_gamepad__WEBPACK_IMPORTED_MODULE_0__[\"gamepadNormalize\"])(gamePad);\n\n    const [ hori1, vert1, l2, hori2, vert2, r2, hori3, vert3 ] = input;\n\n    const rot = vert1 || hori1 ? Math.atan2(vert1, hori1) : 0;\n\n    const btnX = gamePad.buttons[0].pressed;\n    const btnO = gamePad.buttons[1].pressed;\n    const btnTri = gamePad.buttons[2].pressed;\n    const btnSqr = gamePad.buttons[3].pressed;\n    const l1 = gamePad.buttons[4].pressed;\n    const r1 = gamePad.buttons[5].pressed;\n\n    \n    window.viewConfig.x -= hori2 * 0.5;\n    window.viewConfig.y -= vert2 * 0.5;\n    window.viewConfig.zoom += 0.3 * (-l2 + r2);\n\n    if (playerIndex === 0) {\n        // if (l1) {window.viewConfig.rotation += 0.05}\n        // if (r1) {window.viewConfig.rotation -= 0.05}\n        if (l1) { window.viewConfig.x += 0.5 }\n        if (r1) { window.viewConfig.x -= 0.5 }\n    }\n    shootCallback({btnX, btnO, btnTri, btnSqr, rot, hori1, vert1})\n}\n\nfunction shoot({game, playerIndex}, {btnX, btnO, btnSqr, btnTri, rot, hori1, vert1}) {\n\n    const pos = game.gorilla_pos(playerIndex);\n    const mag = Math.sqrt(vert1*vert1 + hori1*hori1);\n    const power = Math.max(8, 14 * mag);\n    const x = pos.x + hori1 * 0.2;\n    const y = pos.y + vert1 * 0.2;\n\n    const {light, medium, heavy} = shotConfigs;\n\n    let shot = { x, y, rot, power, gorilla_id: playerIndex };\n    if (btnX) {\n        shot.config = light;\n    }\n    if (btnO) {\n        shot.config = medium\n    }\n    if (btnTri) {\n        shot.config = heavy\n    }\n\n    if (btnX || btnO || btnTri) {\n        game.shoot(shot, (Math.random() - 0.5) * 100);\n    }\n}\n\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ });