'use strict';

var store = require('../lib/store');

module.exports = function(app) {
    app.get('/campers', function(req, res, next) {
        // get a letter
        var selectedLetter = String(req.query.q || 'a').substr(0, 1);

        // and make sure it is a letter
        selectedLetter = /[a-z]/.test(selectedLetter) ? selectedLetter : 'a';

        store.getCampers(selectedLetter, function(results) {
            res.render('campers', {
                title: 'Campers',
                selectedLetter: selectedLetter,
                campers: results,
                tabCampers: true});
        });
    });
};
