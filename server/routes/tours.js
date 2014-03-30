'use strict';

var store   = require('../lib/store'),
    sprintf = require('sprintf').sprintf,
    lo      = require('lodash'),
    async   = require('async');


function isPerfect(r, week) {
    var i,perfect = true;
    for (i = 0; i < week*7; i+=7) {
        perfect = perfect && (r[i]!=='0' && r[i+1]!=='0' && r[i+2]!=='0' && r[i+3]!=='0' && r[i+4]!=='0');
    }
    return perfect;
}

function attendance(r, week) {
    var i, count = 0;
    for (i = 0; i < week*7; i++) {
        count += lo.parseInt(r[i]);
    }

    return sprintf('%d/%d', count, week*5);
}

module.exports = function(app) {

    /*
     * URL: /tours
     */
    app.get('/tours', function(req, res, next) {
        store.getTours(function(err, results) {
            if (results) {
                res.render('tours', {
                    title:    'Tours',
                    login:     req.user,
                    tours:    results,
                    tabTours: true});
            }
        });
    });

    /*
     * URL: /tours/55
     */
    app.get('/tours/:tour_id([0-9]{1,6})', function(req, res, next) {
        var tourId = req.params.tour_id;
        var sort = req.query.sort || 'name';
        var now = new Date().getTime();

        async.parallel([
                function(done) { store.getTour(tourId, done); },
                function(done) { store.getTourCampers(tourId, sort, done); },
            ],
            function(err, results) {
                var i, len, tour, campers, title, week;

                if (results) {
                    tour    = results[0];
                    campers = results[1];
                    title   = 'Tour ' + tourId;
                    len     = campers.length;
                    week    = 0;


                    if (now >= tour.startDate.getTime() && now <= tour.endDate.getTime()) {
                        week = Math.ceil((now - tour.startDate.getTime()) / (7*24*3600*1000));
                    }

                    for (i = 0; i < len; i++) {

                        if (week > 0 && (campers[i].workoutProgram === 'base' || campers[i].workoutProgram === 'full')) {
                            // In the CURRENT tour ... don't look at all of rollcall
                            campers[i].attendance = attendance(campers[i].rollcall, week);
                            campers[i].perfect     = isPerfect(campers[i].rollcall, week);
                        } else {
                            campers[i].attendance = '-';
                            campers[i].perfect = false;
                        }
                    }

                    res.render('tour', {
                        title:    title,
                        login:    req.user,
                        baseUrl:  '/tours/' + tourId,
                        query:    req.query,
                        tourId:   tourId,
                        campers:  campers,
                        tabTours: true});
                }
            }
        );
    });

    /*
     * URL: /tours/55/rollcall
     */
    app.get('/tours/:tour_id([0-9]{1,6})/rollcall', function(req, res, next) {
        var tourId = req.params.tour_id,
            week   = lo.parseInt(req.query.week) || 0,
            now = new Date().getTime();

        async.parallel([
                function(done) { store.getTour(tourId, done); },
                function(done) { store.getRollcall(tourId, done); }
            ],
            function(err, results) {
                var tour, campers;

                if (results) {
                    tour = results[0];
                    campers = results[1];

                    if (week === 0 && now >= tour.startDate.getTime() && now <= tour.endDate.getTime()) {
                        week = Math.ceil((now - tour.startDate.getTime()) / (7*24*3600*1000));
                    }

                    week = Math.max(week, 1);
                    week = Math.min(week, 6);

                    var i, len = campers.length;
                    for (i = 0; i < len; i++) {
                        campers[i].rollcall = campers[i].rollcall.substr((week-1)*7, 7);
                    }

                    res.render('rollcall', {
                        title:    sprintf('Tour %s: Rollcall', tourId),
                        login:    req.user,
                        tourId:   tourId,
                        campers:  campers,
                        week:     week,
                        tabTours: true
                    });
                }
            }
        );
    });

    /*
     * URL: /tours/55/activity
     */
    app.get('/tours/:tour_id([0-9]{1,6})/activity', function(req, res, next) {
        var tourId = req.params.tour_id;

        res.render('activity', {
            title:    sprintf('Tour %s: Activity', tourId),
            login:    req.user,
            tourId:   tourId,
            tabTours: true
        });
    });



    /*
     * URL: /tours/55/payments
     */
    app.get('/tours/:tour_id([0-9]{1,6})/payments', function(req, res, next) {
        var tourId = req.params.tour_id;

        res.render('payments', {
            title:    sprintf('Tour %s: Payments', tourId),
            login:    req.user,
            tourId:   tourId,
            tabTours: true
        });
    });




    app.get('/tours/add', function(req, res, next) {
        res.render('addtour', {
            title:    'Add Tour',
            login:    req.user,
            tabTours: true
        });
    });

};
