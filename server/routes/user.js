'use strict';

var store   = require('../lib/store'),
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
    var userId = req.params.user_id;
    var campId = req.query.camp_id || 0;

    store.getUser(userId, function(err, results) {
        var camper = results;
        if (results) {
            store.getCampsAttended(userId, function(err, results) {
                var obj;
                if (campId > 0) {
                    // campId set - find the corresponding tourId
                    obj = _.find(results, function(t) { return t.id == campId; });
                } else {
                    // campId not set - return most recent tour
                    obj = _.last(results);
                }

                obj = obj || { tour_id: 0};
                camper.tourId = obj.tour_id || 0;

                res.render('users/user', {
                    camper:   camper,
                    camps:    results,
                    campId:   campId,
                    title:    sprintf('%s %s', camper.firstName, camper.lastName),
                    login:    req.user,
                    tabUsers: true});
            });
        } else {
            next(new Error(sprintf("Camper with id %s does not exist", userId)));
        }
    });
};
