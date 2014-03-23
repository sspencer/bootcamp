'use strict';

/*
 * Express Dependencies
 */
var express = require('express'),
    exphbs  = require('express3-handlebars'),
    config  = require('./config'),
    routes  = require('./server/routes'),
    fs      = require('fs'),
    helpers = require('./server/lib/helpers');



var app          = express(),
    loggerConfig = null;

app.locals({
  dev: app.get('env') === 'development',
  ServerName: config.name,
  ServerVersion: config.version
});

app.set('port', config.server.port);

function developmentApp() {
    var hbs = exphbs.create({
        extname:       '.hbs',
        defaultLayout: 'main',
        layoutsDir:    'views/layouts/',
        partialsDir:   'views/partials/',
        helpers:       helpers
    });


    app.engine('hbs', hbs.engine);

    app.set('views', __dirname + '/views');
    app.set('view engine', 'hbs');

    // Static assets served by express in develemont
    app.use(express.static(__dirname + '/assets'));
}

function productionApp() {
    var hbs = exphbs.create({
        extname:       '.hbs',
        defaultLayout: 'main',
        layoutsDir:    'dist/views/layouts/',
        partialsDir:   'dist/views/partials/',
        helpers:       helpers
    });

    app.engine('hbs', hbs.engine);
    app.enable('view cache');

    app.set('views', __dirname + '/dist/views');
    app.set('view engine', 'hbs');

    // NOTE: Static assets served by nginx in production
}


if (app.get('env') === 'development') {
    developmentApp();
    loggerConfig = {format:'dev'};
} else {
    productionApp();

    loggerConfig = {
        format:'default',
        stream: fs.createWriteStream('/var/log/node/dashboard.log')
    };
}

app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.logger(loggerConfig));

app.use(function (req, res) {
    res.status(404).render('404', {title: 'Not Found :('});
});

app.use(express.errorHandler());

routes(app);

app.listen(app.get('port'), function () {
    console.log('%s server (%s) listening on port %d', config.name, config.version, app.get('port'));
});
