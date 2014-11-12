'use strict';

var store   = require('../lib/store'),
    async   = require('async'),
    sprintf = require('sprintf').sprintf,
    _       = require('lodash');


exports.index = function(req, res, next) {
    // get a letter
    var selectedLetter = String(req.query.q || 'a').substr(0, 1);
    var sort = req.query.sort || 'name';

    // and make sure it is a letter
    selectedLetter = /[a-z]/.test(selectedLetter) ? selectedLetter : 'a';

    store.getCampers(selectedLetter, sort, function(err, results) {
        if (results) {
            res.render('users/index', {
                title:          'Campers',
                login:          req.user,
                selectedLetter: selectedLetter,
                baseUrl:        '/campers',
                query:          req.query,
                campers:        results,
                tabUsers:       true});
        }
    });
};

exports.user = function(req, res, next) {
    var userId = _.parseInt(req.params.user_id);
    var campId = _.parseInt(req.query.camp_id) || 0;

    async.parallel([
            function(done) { store.getCampsAttended(userId, done); },
            function(done) { store.getCamp(campId, done); },
            function(done) { store.getUser(userId, done); }
        ],
        function(err, results) {

            if (err) {
                next(new Error(sprintf("Camper with id %s does not exist", userId)));
                return;
            }

            var camps = results[0];
            var camp = results[1];
            var user = results[2];
            var obj;

            if (campId > 0) {
                // campId set - find the corresponding tourId
                obj = _.find(camps, function(t) { return t.id === campId; });
            } else {
                // campId not set - return most recent tour
                obj = _.last(camps);
            }

            obj = obj || { tour_id: 0};
            user.tourId = obj.tour_id || 0;

            res.render('users/user', {
                camper:   user,
                camps:    camps,
                campId:   campId,
                title:    sprintf('%s %s', user.firstName, user.lastName),
                login:    req.user,
                tabUsers: true});
        }
    );

};

exports.userPREVIOUS = function(req, res, next) {
    var userId = req.params.user_id;
    var campId = req.query.camp_id || 0;

    store.getCampsAttended(userId, function(err, camps) {
        var obj;

        if (campId > 0) {
            // campId set - find the corresponding tourId
            obj = _.find(camps, function(t) { return t.id === campId; });
        } else {
            // campId not set - return most recent tour
            obj = _.last(camps);
        }

        obj = obj || { tour_id: 0};

        // 2014 08 09 - pass in tourId and JOIN when tourId != 0 (or join
        // on campId but that could be faked where we just verified tourId)
        store.getUser(userId, function(err, user) {
            if (user) {
                user.tourId = obj.tour_id || 0;

                res.render('users/user', {
                    camper:   user,
                    camps:    camps,
                    campId:   campId,
                    title:    sprintf('%s %s', user.firstName, user.lastName),
                    login:    req.user,
                    tabUsers: true});
            } else {
                next(new Error(sprintf("Camper with id %s does not exist", userId)));
            }
        });
    });
};
