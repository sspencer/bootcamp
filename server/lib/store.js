'use strict';

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
    'name':             'firstName ASC, lastName ASC',
    '-name':            'firstName DESC, lastName ASC',
    'yearStarted':      'yearStarted ASC, firstName ASC, lastName ASC',
    '-yearStarted':     'yearStarted DESC, firstName ASC, lastName ASC',
    'current_tour_id':  'current_tour_id ASC, firstName ASC, lastName ASC',
    '-current_tour_id': 'current_tour_id DESC, firstName ASC, lastName ASC',
    'camps':            'camps ASC, firstName ASC, lastName ASC',
    '-camps':           'camps DESC, firstName ASC, lastName ASC',
    'occupation':       'occupation ASC',
    '-occupation':      'occupation DESC'
};

var TourSort = {
    'name':            'firstName ASC, lastName ASC',
    '-name':           'firstName DESC, lastName ASC',
    'workoutProgram':  'workoutProgram ASC, firstName ASC, lastName ASC',
    '-workoutProgram': 'workoutProgram DESC, firstName ASC, lastName ASC',
    'workoutGroup':    'workoutGroup ASC, firstName ASC, lastName ASC',
    '-workoutGroup':   'workoutGroup DESC, firstName ASC, lastName ASC',
    'workoutTime':     'workoutTime ASC, firstName ASC, lastName ASC',
    '-workoutTime':    'workoutTime DESC, firstName ASC, lastName ASC',
    'pushup1':         'pushup1 ASC, firstName ASC, lastName ASC',
    '-pushup1':        'pushup1 DESC, firstName ASC, lastName ASC',
    'situp1':          'situp1 ASC, firstName ASC, lastName ASC',
    '-situp1':         'situp1 DESC, firstName ASC, lastName ASC',
    'mile1':           'mile1 ASC, firstName ASC, lastName ASC',
    '-mile1':          'mile1 DESC, firstName ASC, lastName ASC',
    'situp2':          'situp2 ASC, firstName ASC, lastName ASC',
    '-situp2':         'situp2 DESC, firstName ASC, lastName ASC',
    'push2':           'push2 ASC, firstName ASC, lastName ASC',
    '-push2':          'push2 DESC, firstName ASC, lastName ASC',
    'mile2':           'mile2 ASC, firstName ASC, lastName ASC',
    '-mile2':          'mile2 DESC, firstName ASC, lastName ASC',
    'payment':         'paymentMethod ASC, paymentNote ASC, firstName ASC, lastName ASC',
    '-payment':        'paymentMethod DESC, paymentNote DESC, firstName ASC, lastName ASC',
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
    connection.query(sql.selectTours, function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
            cb(null, rows);
        }
    });
};

exports.getTour = function(tourId, cb) {
    connection.query(sql.selectTour, [tourId], function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
            if (rows.length === 0) {
                cb(new Error("No such tour"), null);
            } else {
                cb(null, rows[0]);
            }
        }
    });
};

exports.copyCampers = function(srcTour, dstTour, cb)
{
    connection.query(sql.selectCopyCampInfo, [srcTour], function(err, rows) {
        var copySQL = "";
        var values = [];
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
             // (tour_id, user_id, workoutTime, workoutGroup, workoutProgram)
             rows.forEach(function(row) {
                values.push(sprintf("(%d, %d, '%s', '%s', '%s')", dstTour, row.user_id, row.workoutTime, row.workoutGroup, row.workoutProgram));
             });

            copySQL = sprintf('%s VALUES %s;', sql.copyTourCampersPartial, values.join(', '));
            connection.query(copySQL, function(err2, rows2) {
                if (err2) {
                    handleDisconnect();
                    console.error(err2);
                    cb(err2, null);
                } else {
                    cb(null, { tourId: dstTour });
                }
            });
        }
    });
};

exports.insertTour = function(startDate, endDate, days, basePrice, buffetPrice, dailyPrice, fullPrice, dropinPrice, cb) {
    var params = [0, startDate, endDate, days, basePrice, buffetPrice, dailyPrice, fullPrice, dropinPrice];
    connection.query(sql.insertTour, params, function(err, result) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
//            copyCampers(result.insertId - 1, result.insertId);
        }
    });
};

exports.getTourCampers = function(tourId, sort, cb) {
    var sortOrder = TourSort[sort] || TourSort.name;
    var stmt = sprintf('%s ORDER BY %s', sql.selectTourCampers, sortOrder);
    connection.query(stmt, [tourId], function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
            cb(null, rows);
        }
    });
};

exports.getCampers = function(selectedLetter, sort, cb) {
    var sortOrder = CampersSort[sort] || CampersSort.name;
    var stmt = sprintf('%s ORDER BY %s', sql.selectCampers, sortOrder);

    connection.query(stmt, [selectedLetter], function(err, rows) {
        if (err) {
            console.error(err);
            handleDisconnect();
            cb(err, null);
        } else {
            cb(null, rows);
        }
    });
};

exports.getRollcall = function(tourId, cb) {
    connection.query(sql.selectRollcall, [tourId], function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
            cb(null, rows);
        }
    });
};

exports.getUser = function(userId, cb) {
    connection.query(sql.selectUser, [userId], function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
            cb(null, rows[0]);
        }
    });
};

exports.getCamp = function(campId, cb) {
    if (campId === 0) {
        cb(null, []);
    } else {
        connection.query(sql.selectCamp, [campId], function(err, rows) {
            if (err) {
                handleDisconnect();
                console.error(err);
                cb(err, null);
            } else {
                cb(null, rows[0]);
            }
        });
    }
};


exports.getCampsAttended = function(userId, cb) {
    connection.query(sql.selectCampsAttended, [userId], function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
            cb(null, rows);
        }
    });
};

exports.getNextTourId = function(cb) {
    connection.query(sql.selectNextTourId, function(err, rows) {
        if (err) {
            handleDisconnect();
            console.error(err);
            cb(err, null);
        } else {
            cb(null, rows[0]);
        }
    });
};
