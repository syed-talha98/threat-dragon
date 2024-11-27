var appFactory = require('./src/app.js');

// Create the app instance
var app = appFactory.default.create();

// Check if the app is already bound to an HTTPS server
if (!app.get('httpsRunning')) {
    // Only start the HTTP server if HTTPS is not running
    var server = app.listen(app.get('port'), function() {
        console.log('Development server listening at ' + server.address().address + ' on port ' + server.address().port);
    });

    process.once('SIGUSR2', function () { 
        process.kill(process.pid, 'SIGUSR2'); 
    });
}
