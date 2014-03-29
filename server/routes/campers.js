'use strict';

var store = require('../lib/store');

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
                    user:           req.user,
                    selectedLetter: selectedLetter,
                    baseUrl:        '/campers',
                    query:          req.query,
                    campers:        results,
                    tabCampers:     true});
            }
        });
    });

    app.get('/campers/:camper_id([0-9]{1,6})', function(req, res, next) {
        res.render('camper', {
            title:          'Campers: FirstName LastName',
            user:           req.user,
            tabCampers:     true});
    });

};
