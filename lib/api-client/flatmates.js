import fetch from "node-fetch"
import promisify from "es6-promisify"
import xml2js from "xml2js"

class FlatmatesClient {
    constructor() {
        this.session = ""
        this.secret = ""
    }

    /**
     * Requires asyncronous constructor to obtain api key
     */
    static async create() {
        let client = new FlatmatesClient()
        await client.init()
        return client
    }

    async init() {
        [this.session, this.secret] = await this.auth()
    }

    async auth() {
        let csrf_token_regex = /.*csrf-token.*/g;

        let resp = await fetch('https://flatmates.com.au/')
        let html = await resp.text()

        let csrf_token_xml = csrf_token_regex.exec(html)

        var json = await xml_to_json(csrf_token_xml)

        var csrf_token

        while(csrf_token === undefined && typeof(json) === "object") {
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

        return ["session_token", csrf_token]
    }

     /**
      * Perform an api call to get suburb location and POI autocomplete from flatmates.com.au.
      * POIs : suburb, city, university, tram_stop, train_station
     */
    async autocomplete(input) {
        const url = 'https://flatmates.com.au/autocomplete';

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
        };

        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip,deflate'
        };

        const options = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(reqBody),
            redirect: 'follow',

            // The following properties are node-fetch extensions
            follow: 20,
            timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable
            compress: true,     // support gzip/deflate content encoding. false to disable
            size: 0,            // maximum response body size in bytes. 0 to disable
            agent: null         // http(s).Agent instance, allows custom proxy, certificate etc.
        };

        const resp = await fetch(url, options);
        if ( resp.status != '200' ) {
            throw Error('flatmates.com.au autocomplete API responded with HTTP code: ' + resp.status);
        }
        const json = await resp.json();

        let resultsList = [];
        if(!json.suggest.location_suggest[0].options) {
            throw Error('flatmates.com.au autocomplete API has changed.')
        }
        json.suggest.location_suggest[0].options.forEach(
            rawResult => resultsList.push(rawResult._source)
        );

        return resultsList;
    }
}

const xml_to_json = promisify(xml2js.parseString)

export default FlatmatesClient




