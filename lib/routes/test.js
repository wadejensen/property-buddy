import https from 'https'
import fetch from 'node-fetch'
import fs from 'fs'
import xml2js from 'xml2js'
import promisify from 'es6-promisify'

module.exports = function(app) {

    app.get('/test', function(req, res) {
        const a = 10
        const b = 20
        let c = a * b
        let str = 'hello world '
        res.send(str + c)

        console.log('Test page served.')
    });

    const xml_to_json = promisify(xml2js.parseString)

    function find_key_in_object(object, key_name) {
        for (var key in object) {
            if (key === key_name) {
                return object[key_name]
            }
            else if ( typeof(object[key]) === "object") {
                find_key_in_object(object[key], key_name)
            }
        }
    }

    function find_key_in_object_prom(object, key_name) {
        return new Promise(function(fulfill, reject){
            try {
                fulfill(find_key_in_object(object, key_name))
            } catch (error) {
                reject(error)
            }
        })
    }



    //console.log(JSON.stringify(data))

    async function flatmates_auth() {

    }

    app.get('/flatmates', async function (req, res) {
            let csrf_token_regex = /.*csrf-token.*/g;

            let resp = await fetch('https://flatmates.com.au/')
            let html = await resp.text()

            let csrf_token_xml = csrf_token_regex.exec(html)

            var json = await xml_to_json(csrf_token_xml)

            var csrf_token
            var token_scratch = JSON.parse(JSON.stringify(json))

            while(csrf_token === undefined && typeof(json[key]) === "object") {
                for (var key in json) {
                    if (key === "content") {
                        csrf_token = json["content"]
                    }
                    else if ( typeof(json[key]) === "object") {
                        json = json[key]
                    }
                }
            }

            if (csrf_token === undefined) {
                throw Error("Cannot obtain csrf token for Flatmates.com.au")
            }

            console.log(csrf_token)
            res.send(csrf_token)
    });
}