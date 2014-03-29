'use strict';

// keys for redis

// user:id:steve => 123
exports.userId = function(username) {
    return ['user', 'id', username].join(':');
};

// user:acct:123 => { ... }
exports.userAcct  = function(userid) {
    return ['user', 'acct', userid].join(':');
};
