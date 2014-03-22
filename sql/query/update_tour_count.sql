-- Update grad count with total number of campers per camp.
-- NOTE: since this is not a definitive count of grads/nongrads
-- per camp, just count everyone as graduated for now.
UPDATE tour SET tour.grads =
( SELECT count(*) FROM camp
  WHERE tour.id = camp.tour_id
  GROUP BY camp.tour_id
);
