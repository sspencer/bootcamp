'use strict';

var store = require('../lib/store'),
    sprintf = require('sprintf').sprintf,
    lo = require('lodash');


module.exports = function(app) {
    app.get('/tours', function(req, res, next) {
        store.getTours(function(results) {
            res.render('tours', {
                title:    'Tours',
                user:     req.user,
                tours:    results,
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
                user:     req.user,
                baseUrl:  '/tours/' + tourId,
                query:    req.query,
                tourId:   tourId,
                tour:     results,
                tabTours: true});
        });
    });

    app.get('/tours/:tour_id([0-9]{1,6})/rollcall', function(req, res, next) {
        var tourId = req.params.tour_id,
            week   = lo.parseInt(req.query.week) || 1;

        week = Math.max(week, 1);
        week = Math.min(week, 6);

        store.getRollcall(tourId, function(results) {
            var i, len = results.length;
            for (i = 0; i < len; i++) {
                results[i].rollcall = results[i].rollcall.substr((week-1)*7, 7);
            }

            res.render('rollcall', {
                title:    sprintf('Tour %s: Rollcall', tourId),
                user:     req.user,
                tourId:   tourId,
                campers:  results,
                week:     week,
                tabTours: true
            });
        })
    });

    app.get('/tours/add', function(req, res, next) {
        res.render('addtour', {
            title: 'Add Tour',
            user:  req.user,
            tabTours: true
        });
    });

};
