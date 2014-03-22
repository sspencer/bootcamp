'use strict';

module.exports = function(app) {
    app.get('/tours', function(req, res, next) {
        res.render('tours', {title: 'Tours', tabTours: true});
    });
};
