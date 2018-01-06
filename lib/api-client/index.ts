import {FlatmatesClient} from "./FlatmatesClient"
import {DomainClient} from "./DomainClient"
import RealestateClient from "./RealestateClient"

import DomainListingRequestBody from "../model/domain/DomainListingRequestBody"

export async function InitApiClients() {
    try {
        await FlatmatesClient.Init()
        console.dir(FlatmatesClient)
        
        var reqBody: any = {
            "search":
                {
                    "mode":"rooms",
                    "min_budget":100,
                    "max_budget":2000,
                    "top_left":"-33.878453691548835,151.16001704415282",
                    "bottom_right":"-33.90481527152859,151.2626705475708"
                }
        }
    
        let data: any = await FlatmatesClient.GetListings(reqBody)
        console.log(data)
    }
    catch (e) {
        console.log("Could not create flatmates.com.au API client.")
        console.log(e.message)
        process.exit(1)
    }

    // //console.dir(app)
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

    const json = await domainClient.GetListings(reqBody)
    
    console.log(json)
    // for ( node in json) {
    //     console.log(node)
    // }

    // let realestateClient =  new RealestateClient()

    // reqBody = {
    //     "channel": "rent",
    //     "filters": {
    //         "surroundingSuburbs": "true",
    //         "excludeTier2": "true",
    //         "geoPrecision": "address",
    //         "excludeAddressHidden": "true"
    //     },
    //     "boundingBoxSearch": [-33.92398881477445, 151.18771071506796, -33.92047668262983, 151.19207198692618],
    //     "pageSize": "20"
    // }

    // json = await realestateClient.getListings(reqBody)
    // console.log(json)
    // let x = 5 + 10
    // let y = x * 7
}
