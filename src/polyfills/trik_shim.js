// These polyfills are 

/* POLYFILLS_START */
import 'core-js/es/object/assign';
import 'core-js/es/array/fill';
import 'core-js/es/array/filter';
import 'core-js/es/array/map';
// polyfill broken in TRIK js engine, so an alternative one is defined here
{
    Array.from = function(x) {
        const ret = [];
        for (const a of x) {
            ret.push(a);
        }
        return ret;
    }
}
// polyfill broken in TRIK js engine, so an alternative one is defined here
Array.prototype.includes = function(x) {
    return this.indexOf(x) !== -1;
};
import 'core-js/es/array/reduce';
import 'core-js/es/symbol';
import 'core-js/es/symbol/iterator';
import 'core-js/es/string/repeat';
import 'core-js/es/math/log2';
import 'core-js/es/math/sign';

// Needed for generators (function*) to work
import 'regenerator-runtime/runtime'; 
/* POLYFILLS_END */

import trik_script from "trik_script";

/* clean global namespace */
let original_print = global.print;
delete global.print;

if (typeof console === 'undefined') {
    console = {};
}

function gen_object_dump(obj) {
    if (obj === null) return 'null';
    if (typeof obj === 'number') return obj.toString();
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'undefined') return 'undefined';
    if (Array.isArray(obj)) {
        let s = "[";
        for (const p of obj) {
            s += gen_object_dump(p) + ", ";
        }
        s = s.slice(0, -2) + "]";
        return s;
    }
    if (typeof obj === 'object') {
        //if (obj.toString !== Object.prototype.toString)
        const strigified = obj.toString();
        const dump = JSON.stringify(obj);
        if (strigified !== '[object Object]') return strigified + ' ' + dump;
        if (typeof obj.constructor === 'function') {
            //if (typeof obj.constructor.name === "string")
            return '[object ' + obj.constructor.name + ']  ' + dump;
        }
    }
    return String(obj);
}

function console_stringify() {
    let args = Array.prototype.slice.call(arguments);
    if (args.length === 0) return;
    let o = '';
    for (const obj of args) {
        if (o.length != 0) o += ' ';
        o += gen_object_dump(obj);
    }
    return o;
}

if (!console.hasOwnProperty('log')) {
    console.log = function() {
        let args = Array.prototype.slice.call(arguments);
        original_print(console_stringify(...args));
    };
}

if (!console.hasOwnProperty('assert')) {
    console.assert = function(assertion) {
        if (!assertion) {
            const message = "assertion failed: " + console_stringify(...Array.prototype.slice.call(arguments));
            console.log(message);
            throw new Error(message);
        }
    }
}

const timers = [];

const register_timer = function(timer, callback) {
    const id = timers.length;
    timers.push(timer);
    timer.timeout.connect(callback)
    return id;
}

setInterval = function(callback, interval) {
    const timer = trik_script.timer(interval);
    return register_timer(timer, callback);
}

setTimeout = function(callback, timeout) {
    const timer = trik_script.timer(timeout);
    timer.setSingleShot(true);
    return register_timer(timer, callback);
}

clearTimeout = clearInterval = function(id) {
    timers[id].stop();
}
