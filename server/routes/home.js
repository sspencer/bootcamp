'use strict';

module.exports = function(app) {
    app.get('/', function(req, res, next) {
        res.render('index', {
            login:          req.user,
            title:         '805 Bootcamp',
            hideLoginLink: true
        });
    });
};
