'use strict';

var sprintf = require('sprintf').sprintf;

exports.index = function(req, res, next) {
    res.render('home/index', {
        login:          req.user,
        title:         '805 Bootcamp',
        hideLoginLink: true
    });
};

exports.error404 = function (req, res, next) {
    res.status(404).render('home/404', {
        layout: 'error',
        title:  'Page Not found',
        url: req.url
    });
};

exports.error500 = function(devmode) {
    return function(err, req, res, next) {
        var title;
        err.status = err.status || 500;

        if (devmode) {
            title = sprintf('HTTP/%d: %s', err.status, err.message);
        } else {
            title = err.message;
        }

        // Prevents stacktrace leakage by passing (error = {}) in production
        res.status(err.status).render('home/50X', {
            layout:  'error',
            title:   title,
            message: title,
            error:   (devmode ? err : {})
        });
    };
};
