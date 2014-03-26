'use strict';

var passport = require('passport'),
    sprintf  = require('sprintf').sprintf;

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
    app.use('/campers', ensureAuthenticated);

    /*************************************************************************************
     * Login Pages
     *************************************************************************************/
    app.get('/login', function(req, res){
        res.render('', {
            layout:'signin',
            user: req.user,
            message:
            req.flash('error')
        });
    });

    app.post('/login',
        passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
        function(req, res) {
            res.redirect(LOGGED_IN);
        }
    );

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });


    /*************************************************************************************
     * Actual Website
     *************************************************************************************/
    require('./home')(app);
    require('./campers')(app);
    require('./tours')(app);


    /*************************************************************************************
     * Errors
     *************************************************************************************/

    // This is the last route and will catch everything not already served.
    app.use(function (req, res, next) {
        var err = new Error('Page not Found');
        err.status = 404;
        next(err);
    });

    // Display errors.
    app.use(function(err, req, res, next) {
        err.status = err.status || 500;

        var title = sprintf('%d %s', err.status, err.message);

        // Prevents stacktrace leakage by passing (error = {}) in production
        res.status(err.status).render('error', {
            title:   title,
            message: title,
            error:   (app.get('env') === 'development' ? err : {})
        });
    });

};

