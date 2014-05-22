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

function addUsersToTour(tourId) {
    // add flag to camp "if never edited"
    // add defaults to camp
    // select user_id,workoutTime,workoutGroup,workoutProgram,source from camp where tour_id=<tour_id>-1
    // insert into camp (id,workoutTime,workoutGroup,workoutProgram,source,"never edited") values (user_id1,...),(user_id2...)
}

function createTour(req) {
}





exports.index = function(req, res, next) {
    store.getTours(function(err, results) {
        if (results) {
            res.render('tours', {
                title:    'Tours',
                login:     req.user,
                tours:    results,
                tabTours: true});
        }
    });
};

exports.tour = function(req, res, next) {
    var tourId = req.params.tour_id;
    var sort = req.query.sort || 'name';
    var now = new Date().getTime();

    async.parallel([
            function(done) { store.getTour(tourId, done); },
            function(done) { store.getTourCampers(tourId, sort, done); },
        ],
        function(err, results) {
            var i, len, tour, campers, title, week;

            if (err) {
                next(err);
            } else {
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

                res.render('tours/tour', {
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
};

exports.rollcall = function(req, res, next) {
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

                res.render('tours/rollcall', {
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
};


exports.stats = function(req, res, next) {
    var tourId = req.params.tour_id;

    store.getTourCampers(tourId, 'name', function(err, results) {
        var campers, stats1;

        stats1 = (lo.parseInt(req.query.stats) || 1) === 1;

        if (results) {
            campers = results;

            res.render('tours/camperstats', {
                title:    sprintf('Tour %s: Stats', tourId),
                login:    req.user,
                tourId:   tourId,
                campers:  campers,
                stats1:   stats1,
                tabTours: true
            });
        }
    });
};



exports.payments = function(req, res, next) {
    var tourId = req.params.tour_id;

    res.render('tours/payments', {
        title:    sprintf('Tour %s: Payments', tourId),
        login:    req.user,
        tourId:   tourId,
        tabTours: true
    });
};


exports.add = function(req, res, next) {

    var startDate, endDate;

    store.getNextTourId(function(err, nextTour) {
        var nextTourId = nextTour.tourId -1;

        store.getTour(nextTourId, function(err, tour) {
            var d;
            if (tour) {
                d = new Date(tour.startDate.getTime() + (7 * 7 * 24 * 3600 * 1000));
                startDate = sprintf('%04d-%02d-%02d', d.getFullYear(), d.getMonth()+1, d.getDate());
                d = new Date(tour.endDate.getTime() + (7 * 7 * 24 * 3600 * 1000));
                endDate = sprintf('%04d-%02d-%02d', d.getFullYear(), d.getMonth()+1, d.getDate());

                res.render('tours/add', {
                    title:     'Add Tour',
                    tourId:    nextTour.tourId,
                    startDate: startDate,
                    endDate:   endDate,
                    login:     req.user,
                    csrf:      req.csrfToken(),
                    tabTours:  true
                });
            }
        });
    });
};

exports.postAdd = function(req, res, next) {

    // result of insert if new tour id
    // store.insertTour(params, function(err, newTourId) {
    //     addUsersToTour
    // })
    var body = JSON.stringify(req.body);
    res.render('home/dbg', {
        title: 'Debug Add Tour',
        body:  body
    });
};
