'use strict';

var sprintf = require('sprintf').sprintf;

/* Handlebar helpers. */
var Months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

exports.fmtDate = function(d) {
    return sprintf("%s %d, %d", Months[d.getMonth()], d.getDate(), d.getFullYear());
};
