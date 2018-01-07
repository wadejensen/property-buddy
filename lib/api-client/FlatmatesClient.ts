//import {Promise} from 'es6-promise'
import fetch, { Response, Headers } from "node-fetch"
import {promisify} from 'typed-promisify'
import * as xmljs from "xml2js"

import {format} from "util"

import { JsonConvert, ValueCheckingMode } from "json2typescript";
import { Listing } from "../model/Listing";

export class FlatmatesClient {
    private static instance: FlatmatesClient
    private static session: string
    private static secret: string
    private static jsonConverter: JsonConvert
    

    /**
     * Private constructor. FlatmatesClient should be created with FlatmatesClient.create()
     */
    private constructor() {
        FlatmatesClient.jsonConverter = new JsonConvert();
        //FlatmatesClient.jsonConverter.operationMode = OperationMode.LOGGING; // print some debug data
        FlatmatesClient.jsonConverter.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
        FlatmatesClient.jsonConverter.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
    }

    static getInstance() {
        if (this.instance === null || this.instance === undefined) {
            this.instance = new FlatmatesClient();
        }
        return this.instance;
    }
    
    /**
     * Requires asynchronous constructor to obtain api key
     */
    static async Init(): Promise<FlatmatesClient> {
        let client = new FlatmatesClient()
        return await client.Auth()
    }

    async Auth(): Promise<FlatmatesClient> {
        let resp: Response = await fetch('https://flatmates.com.au/')
        
        FlatmatesClient.session = await this.extractSessionToken(resp)
        if ( FlatmatesClient.session === undefined ) {
            throw new Error("Cannot obtain session token for Flatmates.com.au")
        }

        FlatmatesClient.secret = await this.extractSecretToken(resp)
        if ( FlatmatesClient.secret === undefined ) {
            throw Error("Cannot obtain csrf token for Flatmates.com.au")
        }
        return FlatmatesClient.getInstance()
    }

    private async extractSessionToken(resp: Response) {
        let headers: any = resp.headers
        let cookieStr: string = <string> headers._headers['set-cookie'][1]
        return cookieStr.split(';')[0]+';'
    }

    private async extractSecretToken(resp: Response) {
        let csrfTokenRegex: RegExp = /.*csrf-token.*/g
        let html = await resp.text()
        let csrf_token_xml: any = csrfTokenRegex.exec(html)

        let json: any = await xmlToJson(<string>csrf_token_xml, {})
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

//      /**
//       * Perform an api call to get suburb location and POI autocomplete from flatmates.com.au.
//       * POIs : suburb, city, university, tram_stop, train_station
//      */
//     async autocomplete(input) {
//         const url = 'https://flatmates.com.au/autocomplete'

//         const reqBody = {
//             "location_suggest":{
//                 "text": input,
//                 "completion":{
//                     "field":"suggest",
//                     "size":input.length,
//                     "fuzzy":{"fuzziness":"AUTO"},
//                     "contexts": {
//                         "location_type":["suburb","city","university","tram_stop","train_station"]
//                     }
//                 }
//             }
//         }
//         try {
//             let resp = await this.httpPost(url, reqBody)
//              if ( resp.status !== '200' ) {
//                  throw Error('flatmates.com.au autocomplete API responded with HTTP code: ' + resp.status)
//              }
//              const json = await resp.json()

//              let resultsList = []
//              if(!json.suggest.location_suggest[0].options) {
//                  throw Error('flatmates.com.au autocomplete API has changed.')
//              }
//              json.suggest.location_suggest[0].options.forEach(
//                  rawResult => resultsList.push(rawResult._source)
//              )

//              return resultsList
//         }
//         catch (e) {
//             console.log(e)
//             console.log('Request to flatmates.com.au autocomplete API failed.')
//         }
//     }

    static async GetListings(listingSearchOpts: any): Promise<[Listing]> {
        const data: any = await FlatmatesClient.mapMarkersApi(listingSearchOpts)
        const flatmatesListings: any = data.matches
        const listing: [Listing] = flatmatesListings.map(FlatmatesClient.normaliseListing)
        return listing
    }

    private static normaliseListing(fmListing: any): Listing {
        // Convert Flatmates listing to core data model Listing type
        const cdmListing = {
            "id":           fmListing.id.toString() || "",
            "title":        format("%s. %s", fmListing.head, fmListing.subheading) || "",
            "source":       "flatmates",
            "listingType":  "share",
            "lat":          fmListing.latitude || NaN,
            "lon":          fmListing.longitude || NaN,
            "price":        fmListing.rent || NaN,
            "address":      "",
            "bedrooms":     NaN,
            "bathrooms":    NaN,
            "carspaces":    NaN,
            "listingUrl":   "www.flatmates.com.au" + fmListing.listing_link,
            "imageUrl":     fmListing.photo || "",
        }
        const listing: Listing = FlatmatesClient.jsonConverter.deserialize(cdmListing, Listing)
        return listing
    }

    private static async mapMarkersApi(reqBody: any) {
        const url = 'https://flatmates.com.au/map_markers'
        const http_promise = require('request-promise')

        const options = {
            method: 'POST',
            uri: 'https://flatmates.com.au/map_markers',
            body: JSON.stringify(reqBody),
            headers: {
                'Accept-Encoding': 'gzip, deflate, br',
                'Content-Type': 'application/json;charset=UTF-8',
                'Cookie' : FlatmatesClient.session,
                'X-CSRF-Token': FlatmatesClient.secret
            },
            gzip: true
        }

        try {
            return await http_promise(options).then( (body: any) => JSON.parse(body) )
        }
        catch (err) {
            console.log(err)
            throw Error('flatmates.com.au map markers API responded with an error.')
        }
    }

    async httpPost(url: string, reqBody: string) {
        const headers = {
            'Content-Type': 'application/jsoncharset=UTF-8',
            'Accept': 'application/json',
            //'Accept-Encoding': 'gzip,deflate'
        }

        const options: any = {
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
        }

        return await fetch(url, options)
    }
}

const xmlToJson = promisify(xmljs.parseString)
