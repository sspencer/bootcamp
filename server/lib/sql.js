'use strict';


// We can get around JavaScript's dislike of multiline strings by embedding the string
// in a comment within an anonymous function.
//
// Trick found here:
//     http://tomasz.janczuk.org/2013/05/multi-line-strings-in-javascript-and.html

function multiline(fn)
{
    return fn.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1].trim();
}

exports.selectTours = multiline(function() {/*
    SELECT
        t.id,
        t.startDate,
        t.endDate,
        COUNT(*) numCampers
    FROM
        tour t
    INNER JOIN
        camp c
    ON
        t.id = c.tour_id
    GROUP BY
        tour_id
    ORDER BY
        startDate
    DESC;
*/});

exports.insertTour = multiline(function() {/*
    INSERT INTO tour
        (id, startDate, endDate, days, basePrice, buffetPrice, dailyPrice, fullPrice, dropinPrice)
    VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?)
*/});

/* insert camp:
    INSERT INTO camp
        (tour_id, user_id)
    VALUES
        (56, 20),
        (56, 484);
*/

exports.selectTour = multiline(function() {/*
    SELECT
        *
    FROM
        tour
    WHERE
        id = ?
*/});

exports.selectTourCampers = multiline(function() {/*
    SELECT
        c.user_id,
        u.firstName,
        u.lastName,
        c.workoutTime,
        c.workoutGroup,
        c.workoutProgram,
        c.rollcall,
        c.mile1,
        c.mile2,
        c.pushup1,
        c.pushup2,
        c.situp1,
        c.situp2
    FROM
        camp c,
        user u
    WHERE
        c.user_id = u.id
        AND
        c.tour_id=?
*/});

exports.selectRollcall = multiline(function() {/*
    SELECT
        c.id,
        c.user_id,
        c.rollcall,
        u.firstName,
        u.lastName,
        c.workoutProgram
    FROM
        camp c
    INNER JOIN
        user u
    ON
        c.tour_id = ?
        AND
        c.user_id = u.id
    ORDER BY
        u.firstName,
        u.lastName
    ASC;
*/});

exports.selectCampers = multiline(function() {/*
    SELECT
        id,
        firstName,
        lastName,
        yearStarted,
        current_tour_id,
        camps,
        occupation
    FROM
        user
    WHERE
        firstName like CONCAT(?, '%')
*/});

exports.selectCampsAttended = multiline(function() {/*
    SELECT
        id,
        tour_id
    FROM
        camp
    WHERE
        user_id = ?
    ORDER BY
        tour_id ASC
*/});

exports.selectCamp = multiline(function() {/*
    SELECT
        *
    FROM
        camp
    WHERE
        id = ?
*/});

exports.selectUser = multiline(function() {/*
    SELECT
        *
    FROM
        user
    WHERE
        id = ?
*/});

exports.selectNextTourId = multiline(function() {/*
    SELECT
        AUTO_INCREMENT tourId
    FROM
        information_schema.tables
    WHERE
        table_name = 'tour'
        AND
        table_schema = DATABASE()
*/});

