import fetch from "node-fetch"
import promisify from "es6-promisify"
import xml2js from "xml2js"

class FlatmatesClient {
    constructor() {
        this.session = ""
        this.secret = ""
    }

    /**
     * Requires asynchronous constructor to obtain api key
     */
    static async create() {
        let client = new FlatmatesClient()
        await client.init()
        return client
    }

    async init() {
        [this.session, this.secret] = await this._auth()
    }

    async _auth() {
        let resp = await fetch('https://flatmates.com.au/')

        let session = await this._extractSessionToken(resp)
        if ( session === undefined ) {
            throw Error("Cannot session token for Flatmates.com.au")
        }

        let token = await this._extractSecretToken(resp)
        if ( token === undefined ) {
            throw Error("Cannot obtain csrf token for Flatmates.com.au")
        }
        return [session, token]
    }

    async _extractSessionToken(resp) {
        let cookieStr = resp.headers._headers['set-cookie'][1]
        return cookieStr.split(';')[0]+';'
    }

    async _extractSecretToken(resp) {
        let csrf_token_regex = /.*csrf-token.*/g
        let html = await resp.text()
        let csrf_token_xml = csrf_token_regex.exec(html)

        let json = await xml_to_json(csrf_token_xml)
        // Walk a JSON tree structure searching for key="content"
        while(typeof(json) === "object") {
            for (let key in json) {
                if (key === "content") {
                    return json["content"]
                }
                else if ( typeof(json[key]) === "object") {
                    json = json[key]
                }
            }
        }
    }

     /**
      * Perform an api call to get suburb location and POI autocomplete from flatmates.com.au.
      * POIs : suburb, city, university, tram_stop, train_station
     */
    async autocomplete(input) {
        const url = 'https://flatmates.com.au/autocomplete'

        const reqBody = {
            "location_suggest":{
                "text": input,
                "completion":{
                    "field":"suggest",
                    "size":input.length,
                    "fuzzy":{"fuzziness":"AUTO"},
                    "contexts": {
                        "location_type":["suburb","city","university","tram_stop","train_station"]
                    }
                }
            }
        }
        try {
            let resp = await this.http_post(url, reqBody)
             if ( resp.status !== '200' ) {
                 throw Error('flatmates.com.au autocomplete API responded with HTTP code: ' + resp.status)
             }
             const json = await resp.json()

             let resultsList = []
             if(!json.suggest.location_suggest[0].options) {
                 throw Error('flatmates.com.au autocomplete API has changed.')
             }
             json.suggest.location_suggest[0].options.forEach(
                 rawResult => resultsList.push(rawResult._source)
             )

             return resultsList
        }
        catch (e) {
            console.log(e)
            console.log('Request to flatmates.com.au autocomplete API failed.')
        }
    }

    async mapMarkers(reqBody) {
        const url = 'https://flatmates.com.au/map_markers'
        const http_promise = require('request-promise');

        const options = {
            method: 'POST',
            uri: 'https://flatmates.com.au/map_markers',
            body: JSON.stringify(reqBody),
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json;charset=UTF-8',
                'Cookie' : this.session,
                'X-CSRF-Token': this.secret
            },
            gzip: true
        }

        try {
            return await http_promise(options).then( body => JSON.parse(body) )
        }
        catch (err) {
            console.log(err)
            throw Error('flatmates.com.au map markers API responded with an error.')
        }
    }

    async http_post(url, reqBody) {
        const headers = {
            'Content-Type': 'application/jsoncharset=UTF-8',
            'Accept': 'application/json'//,
            //'Accept-Encoding': 'gzip,deflate'
        }

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(reqBody),
            redirect: 'follow',

            // The following properties are node-fetch extensions
            follow: 20,
            timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable
            compress: true,     // support gzip/deflate content encoding. false to disable
            size: 10000000,            // maximum response body size in bytes. 0 to disable
            agent: null         // http(s).Agent instance, allows custom proxy, certificate etc.
        }

        return await fetch(url, options)
    }
}

const xml_to_json = promisify(xml2js.parseString)

export default FlatmatesClient




