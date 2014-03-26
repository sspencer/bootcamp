var passport      = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash         = require('connect-flash');

var DBG = true;

// Temporary for testing
var users = [
    { id: 1, username: 'admin', password: 'admin1', admin: 1 },
    { id: 2, username: 'user',  password: 'user1',  admin: 0 }
];


function findByUserId(id, fn) {
    if (DBG) { console.log('FIND BY USER ID(%d)', id); }
    var idx = id - 1;
    if (users[idx]) {
        fn(null, users[idx]);
    } else {
        fn(new Error('User ' + id + ' does not exist'));
    }
}

function findByUsername(username, fn) {
    if (DBG) { console.log('FIND BY USER NAME(%s)', username); }
    var i, user, len;
    for (i = 0, len = users.length; i < len; i++) {
        user = users[i];
        if (user.username === username) {
            return fn(null, user);
        }
    }

    return fn(new Error('User does not exist'), null);
}

function verifyUser(username, password, done) {
    if (DBG) { console.log('VERIFY USER(%s, %s)', username, password); }
    findByUsername(username, function(err, user) {
        if (user === null) {
            done(new Error("User with that name/password does not exist."), null);
        } else {
            if (user.password.trim() === password.trim()) {
                done(null, user);
            } else {
                done(new Error("User with that name/password does not exist."), null);
            }
        }
    });
}

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.
passport.serializeUser(function(account, done) {
    if (DBG) { console.log('SERIALIAZE USER(%j)', account); }
    done(null, account.id);
});

passport.deserializeUser(function(id, done) {
    if (DBG) { console.log('DESERIALIZE USER(%d)', id); }
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
                if (DBG) { console.log('LOCAL VERIFY USER(%s, %s): %j', username, password, account); }
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
