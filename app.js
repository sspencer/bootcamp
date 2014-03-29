'use strict';

/*
 * Express Dependencies
 */
var express    = require('express'),
    exphbs     = require('express3-handlebars'),
    config     = require('./config'),
    redis      = require('./server/lib/redis'),
    RedisStore = require('connect-redis')(express),
    routes     = require('./server/routes'),
    userauth   = require('./server/lib/userauth'),
    helpers    = require('./server/lib/helpers'),
    app        = express();

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

    app.use(express.logger({format:'dev'}));

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

    app.use(express.logger({format:'default'}));

    app.engine('hbs', hbs.engine);
    app.enable('view cache');
    app.set('views', __dirname + '/dist/views');
    app.set('view engine', 'hbs');

    // NOTE: Static assets served by nginx in production
}


if (app.get('env') === 'development') {
    developmentApp();
} else {
    productionApp();
}

app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
    secret: config.server.session_secret,
    store:  new RedisStore({client: redis, prefix: 'sess:' }),
    cookie: { maxAge:null } // cookie: { maxAge:24*3600*1000 }
}));


userauth(app);
routes(app);

app.listen(app.get('port'), function () {
    console.log('%s server (%s) listening on port %d', config.name, config.version, app.get('port'));
});
