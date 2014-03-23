'use strict';

var store = require('../lib/store');

module.exports = function(app) {
    app.get('/tours', function(req, res, next) {
        store.getTours(function(results) {
            res.render('tours', {
                title: 'Tours',
                tours: results,
                tabTours: true});
        });
    });

    app.get('/tours/:tour_id([0-9]{1,6})', function(req, res, next) {
        var tourId = req.params.tour_id;
        store.getTour(tourId, function(results) {
            var title = 'Tour ' + tourId;
            res.render('tour', {
                title: title,
                tourId: tourId,
                tour:results,
                tabTours: true});
        });
    });
};
