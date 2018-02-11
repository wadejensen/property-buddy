//import {Promise} from 'es6-promise'
import fetch, { Response, Headers } from "node-fetch"
import {promisify} from 'typed-promisify'
import * as xmljs from "xml2js"

import {format} from "util"
import {sleep} from "../sleep"

import { JsonConvert, ValueCheckingMode } from "json2typescript";
import { Listing } from "../model/Listing";
import {FlatmatesAutocompletePoi} from "../model/flatmates/FlatmatesAutocompletePoi"
import { FlatmatesGetListingsRequestBody } from "../model/flatmates/FlatmatesGetListingsRequestBody";
import { GeoUtils } from "./GeoUtils";
import { Rectangle } from "../geoutils/GeoUtils";

export class FlatmatesClient {
    private static instance: FlatmatesClient
    static session: string
    static secret: string
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
        if (! this.instance) {
            this.instance = new FlatmatesClient();
        }
        return this.instance;
    }
    
    /**
     * Requires asynchronous constructor to obtain api key
     */
    static async Init(): Promise<FlatmatesClient> {
        let client = new FlatmatesClient()
        return await client.auth()
    }

    async auth(): Promise<FlatmatesClient> {
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

     /**
      * Perform an api call to get suburb location and POI autocomplete from flatmates.com.au.
      * POIs : suburb, city, university, tram_stop, train_station
     */
    static async Autocomplete(userInput: String) {
        const url = 'https://flatmates.com.au/autocomplete'

        const reqBody: any = {
            "location_suggest":{
                "text": userInput,
                "completion":{
                    "field":"suggest",
                    "size": 5,
                    "fuzzy":{"fuzziness":"AUTO"},
                    "contexts": {
                        "location_type":["suburb","city","university","tram_stop","train_station"]
                    }
                }
            }
        }

        let resp = await FlatmatesClient.httpPost(url, reqBody)
        if ( resp.status !== 200 ) {
            throw Error('flatmates.com.au autocomplete API responded with HTTP code: ' + resp.status)
        }
        const suggestionJson = await resp.json()
        // Black magic indexing into JSON response
        const suggestions = suggestionJson.suggest.location_suggest[0].options
        return suggestions.map( (poi: any) => 
            new FlatmatesAutocompletePoi( poi.text, poi._source.search_title, poi._source.short_title, 
                                          poi._source.latitude, poi._source.longitude ) )
    }

    static async GetListings(lat1: number, lon1: number, lat2: number, lon2: number,
                             mode: string, minPrice: number, maxPrice: number): Promise<[Listing]> {
        
        let area = new Rectangle(lon1, lat1, lon2, lat2)
        let getListings = async function(area: Rectangle) {
            let listings = FlatmatesClient.mapMarkersApi(area, mode, minPrice, maxPrice)
            sleep(300) // Don't want to DDoS Flatmates
            return listings
        }
        let greaterThanOrEqualTo1000 = (results: [any]) => results.length >= 1000
        
        return GeoUtils.RecurseSearch([{}], area, getListings, greaterThanOrEqualTo1000 )
    }

    private static convertToListing(flatmatesListing: any): Listing {
        // Convert Flatmates listing to core data model Listing type
        const cdmListing = {
            "id":           flatmatesListing.id.toString() || "",
            "title":        format("%s. %s", flatmatesListing.head, flatmatesListing.subheading) || "",
            "source":       "flatmates",
            "listingType":  "share",
            "lat":          flatmatesListing.latitude || NaN,
            "lon":          flatmatesListing.longitude || NaN,
            "price":        flatmatesListing.rent || NaN,
            "address":      "",
            "bedrooms":     NaN,
            "bathrooms":    NaN,
            "carspaces":    NaN,
            "listingUrl":   "www.flatmates.com.au" + flatmatesListing.listing_link,
            "imageUrl":     flatmatesListing.photo || "",
        }
        const listing: Listing = FlatmatesClient.jsonConverter.deserialize(cdmListing, Listing)
        return listing
    }

    private static async mapMarkersApi(area: Rectangle, mode: string, 
                                       minPrice: number, maxPrice: number): Promise<[Listing]> {
        const url = 'https://flatmates.com.au/map_markers'
        let reqBody = new FlatmatesGetListingsRequestBody(area.ymax, area.xmin, area.ymin, area.xmax, 
                                                          mode, minPrice, maxPrice)
        
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
            let data = await http_promise(options).then( (body: any) => JSON.parse(body) )
            let flatmatesListings: any = data.matches
            return await flatmatesListings.map(FlatmatesClient.convertToListing)
        }
        catch (err) {
            console.log(err)
            throw Error('flatmates.com.au map markers API responded with an error.')
        }
    }

    private static async httpPost(url: string, reqBody: string) {
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
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
