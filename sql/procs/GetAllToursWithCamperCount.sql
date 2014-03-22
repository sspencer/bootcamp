DROP PROCEDURE IF EXISTS GetAllToursWithCamperCount;
DELIMITER $$
CREATE PROCEDURE GetAllToursWithCamperCount()
DETERMINISTIC
SQL SECURITY INVOKER
BEGIN

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

END
$$
DELIMITER ;

