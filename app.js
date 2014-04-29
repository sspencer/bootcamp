var cluster = require('cluster'),
    config  = require('./config');

if (config.server.cluster === true && cluster.isMaster) {
    //start up workers for each cpu
    require('os').cpus().forEach(function(cpu, index) {
        console.log('forking %s #%d', cpu.model, index);
        cluster.fork();
    });

    cluster.on('death', function(worker) {
        console.log('worker ' + worker.pid + ' died');
        cluster.fork();
    });

} else {
    // load up server as a worker
    require('./bootcamp.js');
}
