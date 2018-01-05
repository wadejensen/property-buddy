import * as express from "express"
import { FlatmatesClient } from "./api-client/FlatmatesClient"
import {InitApiClients} from "./api-client"
import { Server } from "./Server"

import {JsonConvert, OperationMode, ValueCheckingMode} from "json2typescript"
import { Listing } from "./model/Listing";

let app = express()

// Get around ZScaler transparent proxy. Do not do this in prod
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const greeting: string = "Hello World"

console.error(greeting)

let server = new Server(3000)

let x = function(req: Express.Request, res: Express.Response): number {
    console.log("hello world")
    return 50
}

server.addHttpGetEndpoint("/testListing", function(req: Express.Request, res: Express.Response) {

    let rawJson: any = 
    {
        "head":"Newtown, Sydney",
        "subheading":"Furnished room in a share house",
        "photo":"https://flatmates-res.cloudinary.com/image/upload/c_fill,f_auto,h_180,q_auto,w_290/share-house-alice-street--newtown-sydney-L266731.jpg",
        "listing_link":"/P156484",
        "latitude":-33.9039122,
        "longitude":151.176332,
        "rent":[320],
        "id":156484,
        "type":"property"
    }

    let jsonConvert: JsonConvert = new JsonConvert();
    //jsonConvert.operationMode = OperationMode.LOGGING; // print some debug data
    jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
    jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null
    
    // Map to the Listing class
    let listing: Listing

    try { 
        listing = jsonConvert.deserialize(rawJson, Listing);
        console.dir(listing)
    } catch (e) {
        console.error((<Error>e));
    }

    let rawJson0: any = 
    {
        "head":"Newtown, Sydney",
        "subheading":"Furnished room in a share house",
        "picture":"https://flatmates-res.cloudinary.com/image/upload/c_fill,f_auto,h_180,q_auto,w_290/share-house-alice-street--newtown-sydney-L266731.jpg",
        "listing_link":"/P156484",
        "latitude":-33.9039122,
        "longitude":151.176332,
        "rent":[320],
        "id":156484,
        "type":"property"
    }

    let listing0: Listing
    try { 
        listing0 = jsonConvert.deserialize(rawJson0, Listing);
        console.dir(listing0)
    } catch (e) {
        console.error((<Error>e));
    }

})

//require('./routes')(app)
//require('./api-client/index')(app)

InitApiClients()

//require('./routes/test')(app)

//let flatmatesClient = FlatmatesClient.Create()

//console.dir(app.flatmatesClient)

// var reqBody = {
//     "search":
//         {
//             "mode":"rooms",
//             "min_budget":100,
//             "max_budget":2000,
//             "top_left":"-33.878453691548835,151.16001704415282",
//             "bottom_right":"-33.90481527152859,151.2626705475708"
//         }
// }

// let data = await app.flatmatesClient.getListings(reqBody)

//
//
// require('./static')(app);
//
// require('./server')(app);
//

console.log("Hello")