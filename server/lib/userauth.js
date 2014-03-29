'use strict';

var passport      = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    flash         = require('connect-flash'),
    keys          = require('./keys'),
    redis         = require('./redis'),
    crypto        = require('crypto'),
    config        = require('../../config');


function findByUserId(id, done) {
    redis.hgetall(keys.userAcct(id), function(err, account) {
        if (account) {
            done(null, account);
        } else {
            done(new Error('User ' + userId + ' does not exist'), null);
        }
    });
}

function verifyUser(username, password, done)
{
    var msg = "Incorrect username or password.";

    redis.get(keys.userId(username), function(err, userId) {
        if (err) {
            done(err, null);
            return;
        }

        redis.hgetall(keys.userAcct(userId), function(err, account) {
            if (account === null) {
                done(new Error(msg), null);
                return;
            }

            var salt = new Buffer(account.salt, 'base64');
            crypto.pbkdf2(password, salt, config.auth.cryptIterations, config.auth.cryptKeyLen, function(err, hashword) {
                if (err) {
                    done(msg, null);
                } else if (hashword.toString('base64') === account.hash) {
                    done(null, account);
                } else {
                    done(new Error(msg), null);
                }
            });
        });
    });
}


// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(account, done) {
    done(null, account.id);
});

passport.deserializeUser(function(id, done) {
    findByUserId(id, function (err, account) {
        done(err, account);
    });
});

// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
    function(username, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {
            // Find the user by username.  If there is no user with the given
            // username, or the password is not correct, set the user to `false` to
            // indicate failure and set a flash message.  Otherwise, return the
            // authenticated `user`.
            verifyUser(username, password, function(err, account) {
                if (account) { return done(null, account); }
                return done(null, false, { message: 'Unknown user or password'});
            });
        });
    }
));

module.exports = function(app) {
    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
};
