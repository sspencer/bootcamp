'use strict';

var sprintf = require('sprintf').sprintf;
var lo = require('lodash');


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

exports.alphaPager = function(selectedLetter) {
    var i, ch, html = [];
    var alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];

    if (!selectedLetter) {
        selectedLetter = 'a';
    }

    html.push('<ul class="pagination pagination-805">');
    for (i = 0; i < 26; i++) {
        ch = alphabet[i];
        if (ch === selectedLetter) {
            html.push('<li class="active">');
        } else {
            html.push('<li>');
        }

        html.push(sprintf('<a href="?q=%s">%s</a></li>', ch, ch.toUpperCase()));
    }

    html.push('</ul>');
    return html.join('');
};

exports.sort = function(baseUrl, query, title, name) {
    var params = [];
    if (baseUrl.indexOf('?') === -1) {
        baseUrl += '?';
    }

    lo.forEach(query, function(value, name) {
        if (name !== 'sort') {
            params.push(sprintf('%s=%s', name, encodeURIComponent(value)));
        }
    });

    if (params.length > 0) {
        baseUrl += params.join('&');
        baseUrl += '&';
    }

    if (query.sort === name) {
        return sprintf('<a href="%ssort=-%s">%s</a>', baseUrl, name, title);
    } else {
        return sprintf('<a href="%ssort=%s">%s</a>', baseUrl, name, title);
    }
};
