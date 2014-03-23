'use strict';

var store = require('../lib/store');

module.exports = function(app) {
    app.get('/tours', function(req, res, next) {
        store.getTours(function(results) {
            res.render('tours', {title: 'Tours', tours: results, tabTours: true});
        });
    });
};
