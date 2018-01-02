import { Request, Response } from "express"
import {FlatmatesClient} from "../api-client/FlatmatesClient"


export default async function testAuth(req: Request, res: Response) {
    const a = 10
    const b = 20
    let c = a * b
    let str = 'hello world '
    res.json("some string")

    console.log("testing")
    console.log(FlatmatesClient.getInstance)

    console.log('Test page served.')
}

// module.exports = function(app) {

//     // app.get('/testAuth', async function(req, res) {
//     //     const a = 10
//     //     const b = 20
//     //     let c = a * b
//     //     let str = 'hello world '
//     //     res.send(app.flatmatesClient)

//     //     console.log("testing")
//     //     console.log(app.flatmatesClient.secret)

//     //     console.log('Test page served.')
//     // });

//     app.get('/testMapMarkers', async function(req, res) {
//         const reqBody = {
//             "search":
//                 {
//                     "mode":"rooms",
//                     "min_budget":100,
//                     "max_budget":2000,
//                     "top_left":"-33.878453691548835,151.16001704415282",
//                     "bottom_right":"-33.90481527152859,151.2626705475708"
//                 }
//         }

//         let data = await app.flatmatesClient.mapMarkers(reqBody)

//         console.log("testing map markers")
//         console.log('Test page served.')
//         res.send(data)
//     });


//     app.get('/testAutocomplete', async function(req, res) {
//         const a = 10
//         const b = 20
//         let c = a * b
//         let str = 'hello world '

//         let json = await app.flatmatesClient.autocomplete("Redfern")

//         res.send(json)
//         console.log('Test page served.')
//         console.log(json)
//     });

// }