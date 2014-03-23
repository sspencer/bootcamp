'use strict';

module.exports = function(app) {
    require('./home')(app);
    require('./campers')(app);
    require('./tours')(app);
};

