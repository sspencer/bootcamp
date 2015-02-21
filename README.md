# Bootcamp

Web app for my local (exercise) bootcamp using combination of Node/Express using server-side Handlebars with Nginx serving static content.

# User Data

{ id: 568,
  oldid: 'Aimee L',
  yearStarted: 2010,
  first_tour_id: 27,
  current_tour_id: 29,
  firstName: 'Jane',
  lastName: 'Doe',
  gender: 'f',
  ageRange: 0,
  occupation: '',
  pet: '',
  camps: 3,
  grads: 0,
  tourId: 29 }
{ id: 3229,
  tour_id: 29,
  user_id: 568,
  newRecord: 0,
  status: 'other',
  workoutTime: 'workout600p',
  workoutGroup: 'c',
  workoutProgram: 'buffet',
  rollcall: '0000000000000000000000000000000000000000',
  price: 9999,
  credit: 0,
  creditNote: '',
  payment: 0,
  paymentMethod: 'other',
  paymentNote: '',
  source: '',
  mile1: 0,
  mile2: 0,
  pushup1: 0,
  pushup2: 0,
  situp1: 0,
  situp2: 0 }



## TBD

* [grunt-shell](https://github.com/sindresorhus/grunt-shell) to update package version and deploy
* [nginx proxy](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/) to serve static files from nginx, dynamic pages from node
* [nginx, varnish, monit, upstart](http://blog.dealspotapp.com/post/40184153657/node-js-production-deployment-with-nginx-varnish)
* [monit](http://www.unixmen.com/install-and-configure-monit-on-centos-rhel-ubuntu-debian/)




ALTER TABLE `camp` CHANGE `newRecord` `newRecord` TINYINT NOT NULL DEFAULT '0';


August 2014 Notes

Only can add users thru a tour (tour page has Add User button).

User Routes:

/users/75              --- show most recent camp
/users/75?camp_id=4581 --- show that camp

User Page shows:
    user record (editable)
    camp record (editable)
    camps attended table
    tabs could show historical results


## Reports

Export report as CSV file:

    select tour_id, workoutProgram, count(workoutProgram) INTO OUTFILE '/tmp/result.csv' FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' LINES TERMINATED BY '\n' from camp group by tour_id, workoutProgram;
