import {FlatmatesClient} from "./FlatmatesClient"
import {DomainClient} from "./DomainClient"
import {RealestateClient} from "./RealestateClient"

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
        // DISABLE SEARCH DURING DEV SO FLATMATES DOESN'T GET CLUEY
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

    //DISABLE SEARCH DURING DEV SO DOMAIN DOESN'T GET CLUEY
    // const json = await domainClient.GetListings(reqBody)
    // console.log(json)

    let realestateClient =  new RealestateClient()

    reqBody = {
        "channel": "rent",
        "filters": {
            "surroundingSuburbs": "true",
            "excludeTier2": "true",
            "geoPrecision": "address",
            "excludeAddressHidden": "true"
        },
        "boundingBoxSearch": [-33.984913591070864,151.04657031914064,-33.754297399013396,151.3734135808594], // Sydney extremely wide
        //Banora point wide (45 results) [-28.239932882506825,153.4733160680663,-28.178743144078663,153.555026883496],
        "pageSize": "100" // 200 seems to be the max returned
    }

    // let json: any = await realestateClient.GetListings(reqBody)
    // console.log(json)
    // let x = 5 + 10
    // let y = x * 7
}
