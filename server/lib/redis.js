var redis  = require('redis');
var config = require('../../config');


var redisClient = redis.createClient(
    config.redis.port || 6379,
    config.redis.host || "127.0.0.1"
);

// Select Redis database number (0 is productiob)
redisClient.selected_db = (config.redis.database || 0);

exports.client = redisClient;
