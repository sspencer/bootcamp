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

    auth: {
        cryptIterations: 10000,
        cryptKeyLen:     128,
        saltLen:         128
    },

    mysql:   {
        username: "the username",
        password: "the password",
        database: "the databse name",
        host:     "mysql host like 127.0.0.1"
    },

    redis:   {
        host:   "localhost",
        port:     6379,
        database: 0
    }
};

// NODE_ENV specific (server)
var environment = {
    development: {
        server: {
            session_secret: "some secret",
            port:           3000,
            cluster:        false
        }
    },
    production: {
        server: {
            session_secret: "some other secret",
            port:           4000,
            cluster:        true
        }
    }
};

// Set environment specific vars
config.server    = environment[env].server;

module.exports = config;
