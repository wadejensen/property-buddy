var http = require('http')
var util = require('util')

module.exports = function(app) {

    app.get('/test', function(req, res) {
        const a = 10
        const b = 20
        let c = a * b
        let str = 'hello world '
        res.send(str + c)

        console.log('Test page served.')
    });
}