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
    mysql:   {
        username: "the username",
        password: "the password",
        database: "the databse name"
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
            port: 3000
        }
    },
    production: {
        server: {
            port: 8080
        }
    }
};

// Set environment specific vars
config.server    = environment[env].server;

module.exports = config;