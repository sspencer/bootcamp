# Bootcamp

Web app for my local (exercise) bootcamp using combination of Node/Express using server-side Handlebars with Nginx serving static content.

## TBD

* [grunt-shell](https://github.com/sindresorhus/grunt-shell) to update package version and deploy
* [nginx proxy](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/) to serve static files from nginx, dynamic pages from node
* [nginx, varnish, monit, upstart](http://blog.dealspotapp.com/post/40184153657/node-js-production-deployment-with-nginx-varnish)
* [monit](http://www.unixmen.com/install-and-configure-monit-on-centos-rhel-ubuntu-debian/)




ALTER TABLE `camp` CHANGE `newRecord` `newRecord` TINYINT NOT NULL DEFAULT '0';


August 2014 Notes

Forgot campers route - instead, users page always shows latest camp
Route something like users/75:55 (user_id:camp_id)
User Page shows:
    user record (editable)
    camp record (editable)
    camps attended table
    tabs could show historical results
