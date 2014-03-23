'use strict';

var sprintf = require('sprintf').sprintf;

/* Handlebar helpers. */
var Months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

exports.fmtDate = function(d) {
    return sprintf("%s %d, %d", Months[d.getMonth()], d.getDate(), d.getFullYear());
};

exports.upper = function(str) {
    return str.toUpperCase();
};

exports.capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

exports.fmtWorkoutTime = function(str) {
    str = str.substr(7);
    return sprintf('%s:%s', str.substr(0, 1), str.substr(1).toUpperCase());
};
