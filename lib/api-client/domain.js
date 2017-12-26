import fetch from "node-fetch"

class DomainClient {
    // constructor() {
    //     this.session = ""
    //     this.secret = ""
    // }
    //
    // /**
    //  * Requires asynchronous constructor to obtain api key
    //  */
    // static async create() {
    //     let client = new FlatmatesClient()
    //     await client.init()
    //     return client
    // }
    //
    // async init() {
    //     [this.session, this.secret] = await this._auth()
    // }


    /**
     * Domain residential listings public API
     * Required fields:
     * 1 pair of latitude and longitude coordinates and a radius.
     * Listing type
     *
     * let optionsSchema = {
     *   lat: double,
     *   lon: double,
     *   radius: double,
     *   listingType: string, // valid fields: 'buy', 'rent', 'share'
     *   minBed: int,
     *   maxBed: int,
     *   minBath: int,
     *   maxBath: int,
     *   minCar: int,
     *   maxCar: int,
     *   minPrice: int,
     *   maxPrice: int,
     *   //Page: //TODO
     *   //PageSize: //TODO
     * }
     * @param opts
     * @returns {Array}
     */
    async getListingsByCenterAndRadius(opts) {
        const url = 'https://www.domain.com.au/mvc/MarkersJson?';

        /**
         * Check all coord fields are not empty. This will probably break exactly
         * on the equator, but we're only marketing to Australians ;)
         */
        if ( (opts.lat && opts.lon && opts.radius) == null ) {
            throw Error('Latitude and/or longitude coordinates or radius missing.');
        }
        if (opts.radius > 40000) {
            throw Error(
                'Distances greater than 40km are not supported due to API limitations.');
        }

        let reqBody =
            {
                "ListingType": this.listingTypeToEnum(opts.listingType),
                "MinBedrooms": opts.minBed || null,
                "MaxBedrooms": opts.maxBed || null,
                "MinBathrooms": opts.minBath || null,
                "MaxBathrooms": opts.maxBath || null,
                "MinCarspaces": opts.minCar || null,
                "MaxCarspaces": opts.maxCar || null,
                "MinPrice": opts.minPrice || null,
                "MaxPrice": opts.maxPrice || null,
                "MinLandArea": null,
                "MaxLandArea": null,
                "AdvertiserIds": null,
                "PropertyTypes": [],
                "PropertyFeatures": [],
                "Locations": [],
                "LocationTerms": "",
                "Keywords": [],
                "Sort": null,
                "DisplayMap": true,
                "Page": 1, //TODO
                "PageSize": 20, //TODO
                "GeoWindow": {
                    "Circle": {
                        "Center": {
                            "Lat": Number(opts.lat),
                            "Lon": Number(opts.lon)
                        },
                        "Radius": Number(opts.radius)
                    }

                },
                "HasAmbiguousTerm": false,
                "IncludeSurroundingSuburbs": false,
                "SchoolId": null,
                "UpdatedSince": null
            };

        reqBody = {
            "ListingType":1,
            "MinBedrooms":null,
            "MaxBedrooms":null,
            "MinBathrooms":null,
            "MaxBathrooms":null,
            "MinCarspaces":null,
            "MaxCarspaces":null,
            "MinPrice":null,
            "MaxPrice":null,
            "MinLandArea":null,
            "MaxLandArea":null,
            "AdvertiserIds":null,
            "PropertyTypes":[

            ],
            "PropertyFeatures":[

            ],
            "Locations":[

            ],
            "LocationTerms":"",
            "Keywords":[

            ],
            "Sort":null,
            "DisplayMap":true,
            "Page":2,
            "PageSize":20,
            "GeoWindow":{
                "Box":{
                    "TopLeft":{
                        "Lat":-33.8928281090752,
                        "Lon":151.203397860916
                    },
                    "BottomRight":{
                        "Lat":-33.9073077343513,
                        "Lon":151.217280974777
                    }
                }
            },
            "HasAmbiguousTerm":false,
            "IncludeSurroundingSuburbs":false,
            "SchoolId":null,
            "UpdatedSince":null,
            "ListingAttributes":[

            ]
        }

        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain',
            'Accept-Encoding': 'gzip,deflate,br'
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

        console.log(reqBody);

        const resp = await fetch(url, options);

        if ( resp.status != '200' ) {
            throw Error('domain.com.au markers API responded with HTTP code: ' + resp.status);
        }
        const json = await resp.json();
        console.log(json);
        // TODO check the: {TotalResult: 201, and CurrentResultCount: 100 } fields

        let resultsList = [];
        json.ListingGroups.forEach(
            rawResult => {
                let listing = rawResult.Listings[0];
                listing.price = parsePrice(listing.DisplayablePrice);
                resultsList.push(listing);
            }
        );
        return resultsList.filter( result =>  isNaN(result.price) );
    }

    listingTypeToEnum(type) {
        switch(type) {
            case 'Buy': return 0;
            case 'Rent': return 1;
            case 'Share': return 2;
            default: throw Error('Unsupported listing type!');
        }
    }
}

export default DomainClient