DROP PROCEDURE IF EXISTS GetRollcall;
DELIMITER $$
CREATE PROCEDURE GetRollcall(IN __tour_id INT)
DETERMINISTIC
SQL SECURITY INVOKER
BEGIN
    SELECT
        c.id,
        c.user_id,
        u.oldid,
        u.firstName,
        u.lastName,
        c.rollcall
    FROM
        camp c
    INNER JOIN
        user u
    ON
        c.tour_id = __tour_id
        AND
        c.user_id = u.id
    ORDER BY
        u.oldid
    ASC;
END
$$
DELIMITER ;
