'use strict';

var passport = require('passport'),
    auth     = require('./auth'),
    home     = require('./home'),
    user     = require('./user'),
    tours    = require('./tours');


var LOGGED_IN = '/tours';

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = function(app) {

    /*
     * All pages under these mount points require login
     *
     * NOTE: This statement must come before all other routes to keep the pages secure
     */
    app.use('/tours',   ensureAuthenticated);
    app.use('/users', ensureAuthenticated);

    /*************************************************************************************
     * Login Pages
     *************************************************************************************/
    app.get('/login', auth.login);
    app.get('/logout', auth.logout);
    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        auth.postLogin(LOGGED_IN)
    );

    /*************************************************************************************
     * Actual Website
     *************************************************************************************/

    app.get('/', home.index);

    app.get('/users', user.index);
    app.get('/users/:user_id([0-9]{1,6})', user.user); // maybe also have ?camp_id=1234

    // a record from the camp table (user info from a single camp)

    app.get('/tours', tours.index);
    app.get('/tours/:tour_id([0-9]{1,6})', tours.tour);
    app.get('/tours/:tour_id([0-9]{1,6})/camp/:camp_id([0-9]{1,7})', tours.camper);

    app.get('/tours/:tour_id([0-9]{1,6})/rollcall', tours.rollcall);
    app.get('/tours/:tour_id([0-9]{1,6})/stats', tours.stats);
    app.get('/tours/:tour_id([0-9]{1,6})/payments', tours.payments);
    app.get('/tours/add', tours.add);
    app.post('/tours/add', tours.addValidator, tours.postAdd);
    app.get('/tours/add2/:tour_id([0-9]{1,6})', tours.add2); // TBD - this should be post-postAdd
    app.get('/tours/copy', tours.copy);


    /*************************************************************************************
     * Errors
     *************************************************************************************/

    // 404 This is the last route and will catch everything not already served.
    app.use(home.error404);

    // and this will handle the errors
    app.use(home.error500(app.get('env') === 'development'));
};

