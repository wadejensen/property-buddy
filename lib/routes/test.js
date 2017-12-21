import fetch from 'node-fetch'
import xml2js from 'xml2js'
import promisify from 'es6-promisify'

module.exports = function(app) {

    app.get('/testAuth', async function(req, res) {
        const a = 10
        const b = 20
        let c = a * b
        let str = 'hello world '
        res.send(app.flatmatesClient)


        console.log("testing")
        console.log(app.flatmatesClient.secret)

        console.log('Test page served.')
    });

    app.get('/testAutocomplete', async function(req, res) {
        const a = 10
        const b = 20
        let c = a * b
        let str = 'hello world '

        let json = await app.flatmatesClient.autocomplete("Redfern")

        res.send(json)
        console.log('Test page served.')
        console.log(json)
    });

}