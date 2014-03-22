UPDATE user SET user.camps =
( SELECT count(*) FROM camp
  WHERE user.id = camp.user_id
  GROUP BY camp.user_id
);
