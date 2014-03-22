UPDATE user SET user.current_tour_id =
( SELECT  MAX(tour_id) FROM camp
  WHERE user.id = camp.user_id
  GROUP BY camp.user_id
);

UPDATE user SET user.first_tour_id =
( SELECT  MIN(tour_id) FROM camp
  WHERE user.id = camp.user_id
  GROUP BY camp.user_id
);
