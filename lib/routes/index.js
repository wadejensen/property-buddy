var http = require('http')
var util = require('util')
var fs = require('fs')

module.exports = function(app) {

    let options = app.settings.server
    options = {
        "port": 3000
    }

    // Very nasty. Never do this in production
    app.server = http.createServer(app)

    app.server.listen(options.port, function() {
        console.log(util.format('listening on port %d', options.port));
    });

    app.get('/', function(req, res) {
        const a = 10
        const b = 20
        let c = a * b
        let str = 'hello world '
        res.send(str + c)
    });
}