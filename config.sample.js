'use strict';
var project = require('./package.json');

// Export NODE_ENV specific config parameters.
// config = {
//     name:      "",
//     version:   "",
//     env:       "development" || "production" || "test"
//     server:    { ... },
//     mysql:     { ... }
// }


// Shared Properties
var env = process.env.NODE_ENV || 'development';

var config = {
    name:    project.name,
    version: project.version,
    env:     env,

    users: [
        { id: 1, username: 'admin', password: 'admin1', admin: 1 },
        { id: 2, username: 'user',  password: 'user1',  admin: 0 }
    ],

    mysql:   {
        username: "the username",
        password: "the password",
        database: "the databse name",
        host:     "mysql host like 127.0.0.1"
    },

    redis:   {
        server:   "localhost",
        post:     6379,
        database: 0
    }
};

// NODE_ENV specific (server)
var environment = {
    development: {
        server: {
            session_secret: "some secret",
            port:           3000
        }
    },
    production: {
        server: {
            session_secret: "some other secret",
            port:           4000
        }
    }
};

// Set environment specific vars
config.server    = environment[env].server;

module.exports = config;
