import FlatmatesClient from "./FlatmatesClient"
import DomainClient from "./DomainClient"
import RealestateClient from "./RealestateClient"

import DomainListingRequestBody from "../model/domain/DomainListingRequestBody"

module.exports = async function(app) {
    //console.dir(app)
    try {
        app.flatmatesClient = await FlatmatesClient.create()
    }
    catch (e) {
        console.log(e.message)
        console.log("Could not create flatmates.com.au API client.")
        process.exit(1)
    }
    console.dir(app.flatmatesClient)

    var reqBody = {
        "search":
            {
                "mode":"rooms",
                "min_budget":100,
                "max_budget":2000,
                "top_left":"-33.878453691548835,151.16001704415282",
                "bottom_right":"-33.90481527152859,151.2626705475708"
            }
    }

    let data = await app.flatmatesClient.getListings(reqBody)

    let domainClient = new DomainClient()

    let opts = {
       lat1: -33.878453691548835,
       lon1: 151.16001704415282,
       lat2: -33.9073077343513,
       lon2: 151.217280974777,
       listingType: "Rent", // valid fields: 'buy', 'rent', 'share'
       minBed: null,
       maxBed: null,
       minBath: null,
       maxBath: null,
       minCar: null,
       maxCar: null,
       minPrice: 100,
       maxPrice: 20000,
       //Page: //TODO
       //PageSize: //TODO
    }

    reqBody = new DomainListingRequestBody(opts)

    var json = await domainClient.getListings(reqBody)
    // for ( node in json) {
    //     console.log(node)
    // }

    let realestateClient =  new RealestateClient()

    reqBody = {
        "channel": "rent",
        "filters": {
            "surroundingSuburbs": "true",
            "excludeTier2": "true",
            "geoPrecision": "address",
            "excludeAddressHidden": "true"
        },
        "boundingBoxSearch": [-33.92398881477445, 151.18771071506796, -33.92047668262983, 151.19207198692618],
        "pageSize": "20"
    }

    json = await realestateClient.getListings(reqBody)
    console.log(json)
    let x = 5 + 10
    let y = x * 7
}
