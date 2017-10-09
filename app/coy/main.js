/******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _data = __webpack_require__(1);

var _konopasStuff = __webpack_require__(2);

window.apiType = "private";

var parseAndRenderSchedule = function parseAndRenderSchedule(range) {
    var header = range.values[0].map(function (x) {
        return x.toLowerCase();
    });
    var parse = (0, _data.getParser)(header);
    var schedule = range.values.slice(1).map(parse);
    (0, _konopasStuff.renderSchedule)(schedule);
};

window.onGoogleSignIn = function () {
    if (window.apiType !== "private") {
        return;
    }
    document.getElementById("google-sign-out-button").style = "display:inline";
    (0, _data.getSchedule)().then(function (response) {
        parseAndRenderSchedule(response.result);
    });
};

window.googleSignOut = function () {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut();
};

window.handleClientLoad = function () {
    if (window.apiType !== "public") {
        return;
    }
    (0, _data.loadAPI)(function () {
        (0, _data.getPublicSchedule)().then(function (response) {
            parseAndRenderSchedule(response.result);
        });
    });
};

document.addEventListener("DOMContentLoaded", function () {
    if (window.apiType !== "static") {
        return;
    }
    (0, _data.getJSON)("test-data.json", function (range) {
        parseAndRenderSchedule(range);
    });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var API_KEY = "AIzaSyDjNyIageBfz7uJLdluDlS1H9mVuqBMQLc";
var CLIENT_ID = "780719027012-6158h6h7gv9t98tir8tiss7ardqujle6.apps.googleusercontent.com";
var SPREADSHEET_ID = "1vicwHDowugLkBAO2DyD5ccVInhLbMr8tODhpSnLl04A";
var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
var SPREADSHEET = "Kopie von Copy of Schedule Web Data (Don't Edit This)";
var RANGE = SPREADSHEET + "!A1:K300";

module.exports.getParser = function (header) {
    return function (row) {
        if (header.length < row.length) {
            throw new Error("header and row have different lengths");
        }
        var parsed = {};
        row.forEach(function (cell, i) {
            parsed[header[i]] = cell;
        });
        header.forEach(function (prop) {
            if (!row.hasOwnProperty(prop)) {
                row[prop] = "";
            }
        });
        return parsed;
    };
};

module.exports.getPublicSchedule = function () {
    return gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE
    });
};

module.exports.loadAPI = function (onLoad) {
    gapi.load('client', function () {
        gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOCS
        }).then(onLoad);
    });
};

module.exports.getSchedule = function () {
    return gapi.client.request({
        path: '/v4/spreadsheets/' + SPREADSHEET_ID + "/values/" + RANGE,
        root: 'https://sheets.googleapis.com/',
        method: 'GET'
    });
};

module.exports.getJSON = function (url, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined' ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
    xhr.open('get', url, true);
    xhr.onreadystatechange = function () {
        var status = void 0;
        var data = void 0;
        if (xhr.readyState == 4) {
            // `DONE`
            status = xhr.status;
            if (status == 200) {
                data = JSON.parse(xhr.responseText);
                successHandler && successHandler(data);
            } else {
                errorHandler && errorHandler(status);
            }
        }
    };
    xhr.send();
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var konopify = function konopify(schedule) {
    var convertDateFormat = function convertDateFormat(date) {
        return date.split("/").reverse().join("-");
    };

    var parseDateTime = function parseDateTime(dateTime) {
        if (dateTime === undefined) {
            return false;
        }
        var toMins = function toMins(time) {
            var timeParts = time.split(":");
            if (timeParts.length !== 2) {
                return 0;
            }
            return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
        };

        var dateParts = dateTime.split(" ");
        if (dateParts.length !== 2) {
            return false;
        }
        var date = dateParts[0];
        var timeRange = dateParts[1];

        var timeRangeParts = timeRange.split("-");
        if (timeRangeParts.length !== 2) {
            return false;
        }
        var time = timeRangeParts[0];
        var endTime = timeRangeParts[1];
        var mins = toMins(endTime) - toMins(time);
        return {
            mins: mins,
            date: convertDateFormat(date),
            time: time
        };
    };

    var validateEvent = function validateEvent(event) {
        var dateTimeMins = parseDateTime(event.time);
        if (!dateTimeMins) {
            console.warn("Ignoring Event with bad dt:", event);
            return false;
        }

        if (event.format === undefined) {
            console.warn("Ignoring Event with bad format:", event);
            return false;
        }

        if (event.area === undefined) {
            console.warn("Ignoring Event with bad area:", event);
            return false;
        }

        if (event.topic === undefined) {
            console.warn("Ignoring Event with bad topic:", event);
            return false;
        }

        return true;
    };

    var konopifyEvent = function konopifyEvent(event) {
        if (!validateEvent(event)) {
            return false;
        }

        var dateTimeMins = parseDateTime(event.time);
        var tags = [];
        tags.push("room:" + event.room);
        event.format.split(",").forEach(function (tag) {
            if (tag) tags.push("format:" + tag);
        });
        event.area.split(",").forEach(function (tag) {
            if (tag) tags.push("area:" + tag);
        });
        event.topic.split(",").forEach(function (tag) {
            if (tag) tags.push("topic:" + tag);
        });
        if (event.isspecial) {
            tags.push("special");
        }
        var loc = [];
        if (event.language !== undefined) {
            loc = event.language.split(",");
        }
        var konopicEvent = {
            id: event.id,
            title: event.title,
            tags: tags,
            desc: event.description,
            loc: loc,
            people: [],
            organizer: event.organizer
        };
        Object.assign(konopicEvent, dateTimeMins);

        return konopicEvent;
    };

    return schedule.map(konopifyEvent).filter(function (e) {
        return e;
    });
};

module.exports.renderSchedule = function (schedule) {
    var KonOpas = window.KonOpas;
    // KonOpas refers to it's own instance globally :/
    // so this is what we do...
    window.konopas = new KonOpas({
        'id': 'coy',
        'default_duration': 0,
        'time_show_am_pm': true,
        'show_all_days_by_default': true,
        'use_server': false
    });
    window.konopas.hiddenFilterCategories = ["Room"];
    var program = konopify(schedule);
    window.konopas.set_program(program, {
        day: {},
        area: {
            labels: {
                all_areas: 'All Languages',
                area: 'Language'
            }
        },
        tag: {
            categories: ['room', 'format', 'area', 'topic', 'special'], // There is a hack in place to hide the room filter
            labels: {
                all_tags: 'All Categories',
                room: 'Room',
                format: 'Format',
                area: 'Area',
                topic: 'Topic',
                special: 'General'
            },
            promote: ['special']
        }
    });
    window.konopas.set_view();
};

/***/ })
/******/ ]);