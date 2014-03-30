'use strict';

var store   = require('../lib/store'),
    sprintf = require('sprintf').sprintf;


module.exports = function(app) {
    app.get('/campers', function(req, res, next) {
        // get a letter
        var selectedLetter = String(req.query.q || 'a').substr(0, 1);
        var sort = req.query.sort || 'name';

        // and make sure it is a letter
        selectedLetter = /[a-z]/.test(selectedLetter) ? selectedLetter : 'a';

        store.getCampers(selectedLetter, sort, function(err, results) {
            if (results) {
                res.render('campers', {
                    title:          'Campers',
                    login:           req.user,
                    selectedLetter: selectedLetter,
                    baseUrl:        '/campers',
                    query:          req.query,
                    campers:        results,
                    tabCampers:     true});
            }
        });
    });

    app.get('/campers/:camper_id([0-9]{1,6})', function(req, res, next) {
        var userId = req.params.camper_id;
        store.getUser(userId, function(err, results) {
            var camper = results;
            if (results) {
                store.getCampsAttended(userId, function(err, results) {

                    res.render('camper', {
                        camper:     camper,
                        camps:      results,
                        title:      sprintf('%s %s', camper.firstName, camper.lastName),
                        login:      req.user,
                        tabCampers: true});
                });
            } else {
                next(new Error(sprintf("Camper with id %s does not exist", userId)));
            }
        });
    });

};
