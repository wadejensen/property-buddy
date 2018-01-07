import fetch from "node-fetch"
import { format } from "util";
import { JsonConvert, ValueCheckingMode } from "json2typescript";
import { Listing } from "../model/Listing";

export class RealestateClient {
    private static jsonConverter: JsonConvert

    constructor() {
        RealestateClient.jsonConverter = new JsonConvert();
        //this.jsonConverter.operationMode = OperationMode.LOGGING; // print some debug data
        RealestateClient.jsonConverter.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
        RealestateClient.jsonConverter.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
    }

    async GetListings(reqBody: any): Promise<[Listing]> {
        const baseUrl = 'https://services.realestate.com.au/services/listings/search?query='
        const url = baseUrl + JSON.stringify(reqBody)

        const resp = await this.httpGet(url)
        if ( resp.status !== 200 ) {
            throw Error('domain.com.au markers API responded with HTTP code: ' + resp.status);
        }
        const data: any = await resp.json()
        const realestateListings: [any] = this.findRealestateListings(data)
        const listings = <[Listing]> realestateListings.map(this.normaliseListing)

        return listings
    }

    async httpGet(url: string) {
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain',
            'Accept-Encoding': 'gzip,deflate,br'
        }

        const options: any  = {
            method: 'GET',
            headers: headers,
            body: "",
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

    findRealestateListings(data: any): [any] {
        return data.tieredResults[0].results
    }

    normaliseListing(reListing: any): Listing {
        // Convert Realestate listing to core data model Listing type
        const cdmListing = {
            "id":           reListing.listingId.toString() || "",
            "title":        reListing.title  || "",
            "source":       "realestate",
            "listingType":  reListing.channel || "",
            "lat":          reListing.address.location.latitude || NaN,
            "lon":          reListing.address.location.longitude || NaN,
            "price":        [NaN] || NaN,
            "address":      format("%s, %s %s", 
                                   reListing.address.streetAddress || "",
                                   reListing.address.suburb || "",
                                   reListing.address.subdivisionCode || "" ),
            "bedrooms":     parseInt(reListing.features.general.bedrooms) || NaN,
            "bathrooms":    parseInt(reListing.features.general.bathrooms) || NaN,
            "carspaces":    parseInt(reListing.features.general.parkingSpaces) || NaN,
            "listingUrl":   format("realestate.com.au/%s",reListing.prettyUrl) || "",
            "imageUrl":     format("%s%s", reListing.mainImage.server || "", reListing.mainImage.uri || "")
        }
        let listing: Listing = RealestateClient.jsonConverter.deserialize(cdmListing, Listing)
        return listing
    }
}
