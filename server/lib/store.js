var mysql   = require('mysql'),
    config  = require('../../config'),
    sql     = require('./sql'),
    sprintf = require('sprintf').sprintf;

var connection = mysql.createConnection({
  host:     config.mysql.host,
  user:     config.mysql.username,
  password: config.mysql.password,
  database: config.mysql.database
});

// Data driven rather than program logic here :)
var CampersSort = {
    'id':               'id ASC',
    '-id':              'id DESC',
    'name':             'lastName ASC, firstName ASC',
    '-name':            'lastName DESC, firstName ASC',
    'yearStarted':      'yearStarted ASC, lastName ASC, firstName ASC',
    '-yearStarted':     'yearStarted DESC, lastName ASC, firstName ASC',
    'current_tour_id':  'current_tour_id ASC, lastName ASC, firstName ASC',
    '-current_tour_id': 'current_tour_id DESC, lastName ASC, firstName ASC',
    'camps':            'camps ASC, lastName ASC, firstName ASC',
    '-camps':           'camps DESC, lastName ASC, firstName ASC',
    'occupation':       'occupation ASC',
    '-occupation':      'occupation DESC'
};

var TourSort = {
    'name':            'lastName ASC, firstName ASC',
    '-name':           'lastName DESC, firstName ASC',
    'workoutProgram':  'workoutProgram ASC, lastName ASC, firstName ASC',
    '-workoutProgram': 'workoutProgram DESC, lastName ASC, firstName ASC',
    'workoutGroup':    'workoutGroup ASC, lastName ASC, firstName ASC',
    '-workoutGroup':   'workoutGroup DESC, lastName ASC, firstName ASC',
    'workoutTime':     'workoutTime ASC, lastName ASC, firstName ASC',
    '-workoutTime':    'workoutTime DESC, lastName ASC, firstName ASC'
};


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

exports.getTour = function(tourId, sort, cb) {
    var sortOrder = TourSort[sort] || TourSort.name;
    var stmt = sprintf('%s ORDER BY %s', sql.getTour, sortOrder);
    connection.query(stmt, [tourId], function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb([]);
        } else {
            cb(rows);
        }
    });
};

exports.getCampers = function(selectedLetter, sort, cb) {
    var sortOrder = CampersSort[sort] || CampersSort.name;
    var stmt = sprintf('%s ORDER BY %s', sql.getCampers, sortOrder);

    connection.query(stmt, [selectedLetter], function(err, rows) {
        if (err) {
            console.error(err);
            handleDisconnect();
            cb([]);
        } else {
            cb(rows);
        }
    });
};
