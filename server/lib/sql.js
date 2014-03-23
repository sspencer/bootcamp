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

exports.getTours = multiline(function() {/*
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

exports.getTour = multiline(function() {/*
    SELECT
        c.user_id,
        u.firstName,
        u.lastName,
        c.workoutTime,
        c.workoutGroup,
        c.workoutProgram,
        c.rollcall
    FROM
        camp c,
        user u
    WHERE
        c.user_id = u.id
        AND
        c.tour_id=?
    ORDER BY
        u.lastName,
        u.firstName
    ASC;
*/});

exports.getRollcall = multiline(function() {/*
    SELECT
        c.id,
        c.user_id,
        c.rollcall,
        u.firstName,
        u.lastName
    FROM
        camp c
    INNER JOIN
        user u
    ON
        c.tour_id = ?
        AND
        c.user_id = u.id
    ORDER BY
        u.lastName,
        u.firstName
    ASC;
*/});
