var mysql = require('mysql');
var config = require('../../config');
var sql = require('./sql');

var connection = mysql.createConnection({
  host:     config.mysql.host,
  user:     config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database
});


connection.connect();

function handleDisconnect(connection) {
    connection.on('error', function(err) {
        if (!err.fatal) {
            return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
            throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        connection = mysql.createConnection(connection.config);
        handleDisconnect(connection);
        connection.connect();
    });
}

exports.getTours = function(cb) {
    connection.query(sql.getTours, function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb([]);
        } else {
            cb(rows);
        }
    });
};
