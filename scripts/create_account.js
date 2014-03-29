#!/usr/bin/env node

'use strict';

var crypto  = require('crypto'),
    path    = require('path'),
    sprintf = require('sprintf').sprintf,
    lo      = require('lodash'),
    redis   = require('../server/lib/redis'),
    config  = require('../config'),
    keys    = require('../server/lib/keys');

var uid, username, password;

// Insert user account into redis
if (process.argv.length !== 5) {
    console.error(sprintf('USAGE %s userid username password', path.basename(process.argv[1])));
    process.exit(1);
}

uid = lo.parseInt(process.argv[2]);
username = process.argv[3];
password = process.argv[4];

var salt = crypto.randomBytes(config.auth.saltLen);
crypto.pbkdf2(password, salt, config.auth.cryptIterations, config.auth.cryptKeyLen, function(err, encodedPassword) {
    if (err) { // crypto failed
        console.error(err);
        process.exit(2);
    }

    var account = {
        id:    uid,
        user:  username,
        admin: 1,
        salt:  salt.toString('base64'),
        hash:  encodedPassword.toString('base64')
    };

    console.log('Inserting user account into Redis');
    console.log(account);
    redis.multi().hmset(keys.userAcct(uid), account).set(keys.userId(username), uid).exec(function(err, results) {
        if (err) {
            console.error(err);
            process.exit(3);
        } else {
            console.log('DONE');
            process.exit(0);
        }
    });
});

