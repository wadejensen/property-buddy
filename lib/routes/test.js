import https from 'https'
import fetch from 'node-fetch'
import fs from 'fs'

module.exports = function(app) {

    app.get('/test', function(req, res) {
        const a = 10
        const b = 20
        let c = a * b
        let str = 'hello world '
        res.send(str + c)

        console.log('Test page served.')
    });

    app.get('/flatmates', async function(req, res) {

        let resp = await fetch('https://flatmates.com.au/')
                //.then( res => {return res.text()} )
                //.then( return text => {console.log(text)})
                //.catch( (reason) => console.log(reason) )
        console.log(await resp.text())
    });
}