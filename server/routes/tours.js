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
    var len;
    console.log('WEEK: ' + week);
    if (week >= 6) {
        len = 40;
    } else {
        len = week * 7;
    }

    console.log(r);
    var i, count = 0;
    for (i = 0; i < len; i++) {
        count += lo.parseInt(r[i]);
    }

    return sprintf('%d/%d', count, week*5);
}

function createTour(req) {

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
                    tour              = results[0];
                    campers           = results[1];
                    tour.participants = campers.length;
                    title             = 'Tour ' + tourId;
                    len               = campers.length;
                    week              = 0;


                    //if (now >= tour.startDate.getTime() && now <= tour.endDate.getTime()) {
                        week = Math.ceil((now - tour.startDate.getTime()) / (7*24*3600*1000));
                    //}

                    for (i = 0; i < len; i++) {

                        if (week > 0 && week < 7 && (campers[i].workoutProgram === 'base' || campers[i].workoutProgram === 'full')) {
                            // In the CURRENT tour ... don't look at all of rollcall
                            campers[i].attendance = attendance(campers[i].rollcall, week);
                            campers[i].perfect     = isPerfect(campers[i].rollcall, week);
                        } else {
                            campers[i].attendance = 'n/a';
                            campers[i].perfect = false;
                        }
                    }

                    tour.open = (week < 8);

                    res.render('tour', {
                        title:    title,
                        login:    req.user,
                        week:     week,
                        baseUrl:  '/tours/' + tourId,
                        query:    req.query,
                        tour:     tour,
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
    app.get('/tours/:tour_id([0-9]{1,6})/stats', function(req, res, next) {
        var tourId = req.params.tour_id;

        store.getTourCampers(tourId, 'name', function(err, results) {
            var campers, stats1;

            stats1 = (lo.parseInt(req.query.stats) || 1) === 1;

            if (results) {
                campers = results;

                res.render('camperstats', {
                    title:    sprintf('Tour %s: Stats', tourId),
                    login:    req.user,
                    tourId:   tourId,
                    campers:  campers,
                    stats1:   stats1,
                    tabTours: true
                });
            }
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

        var startDate, endDate;

        store.getNextTourId(function(err, nextTour) {
            var nextTourId = nextTour.tourId -1;

            async.parallel([
                    function(done) { store.getTour(nextTourId, done); },
                    function(done) { store.getTourCampers(nextTourId, 'name', done); },
                ],
                function(err, results) {
                    var d, campers, tour;
                    if (results) {
                        tour      = results[0];
                        campers   = results[1];

                        d = new Date(tour.startDate.getTime() + (7 * 7 * 24 * 3600 * 1000));
                        startDate = sprintf('%04d-%02d-%02d', d.getFullYear(), d.getMonth()+1, d.getDate());
                        d = new Date(tour.endDate.getTime() + (7 * 7 * 24 * 3600 * 1000));
                        endDate = sprintf('%04d-%02d-%02d', d.getFullYear(), d.getMonth()+1, d.getDate());

                        res.render('addtour', {
                            title:     'Add Tour',
                            tourId:    nextTour.tourId,
                            startDate: startDate,
                            endDate:   endDate,
                            campers:   campers,
                            login:     req.user,
                            csrf:      req.csrfToken(),
                            tabTours:  true
                        });
                    }
            });
        });
    });

    app.post('/tours/add', function(req, res, next) {

        var body = JSON.stringify(req.body);
        res.render('dbg', {
            title:     'Debug Add Tour',
            body: body
        });
    });

};
