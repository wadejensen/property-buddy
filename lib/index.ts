import * as express from "express"
import { FlatmatesClient } from "./api-client/FlatmatesClient"
import {InitApiClients} from "./api-client"
import { Server } from "./Server";

let app = express()

// Get around ZScaler transparent proxy. Do not do this in prod
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const greeting: string = "Hello World"

console.error(greeting)

let server = new Server(3000)

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