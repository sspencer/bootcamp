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
        var sort = req.query.sort || 'name';

        store.getTour(tourId, sort, function(results) {
            var title = 'Tour ' + tourId;
            res.render('tour', {
                title:    title,
                baseUrl:  '/tours/' + tourId,
                query:    req.query,
                tourId:   tourId,
                tour:     results,
                tabTours: true});
        });
    });
};
