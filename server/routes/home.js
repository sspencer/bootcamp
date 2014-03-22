'use strict';

module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.render('', {layout: 'signin'});
    });

    app.post('/', function(req, res, next) {
        // TBD if successful login...
        res.render('index', {title: 'Welcome to 805 Bootcamp'});
    });
};
