import * as express from "express"
import * as http from "http"
import * as util from "util"

import {FlatmatesClient} from "./api-client/FlatmatesClient"

import testAuth from "./routes/test"

export class Server {
    public app: express.Application

    private server: http.Server
   
    constructor(port: number) {
        //create express application
        this.app = express();
        this.app.listen(port, function() {
            console.log(util.format('listening on port %d', port));
        })
               
        //configure application
        this.config();
      
        //add routes
        this.routes();
      
        //add api
        this.api();
    }

    private config() {

    }

    private routes() {    
        this.app.get('/', function(req, res) {
            const a = 10
            const b = 20
            let c = a * b
            let str = 'hello world '
            res.send(str + c)
        });

        this.app.get('/testAuth', testAuth);
    
        this.app.get('/testMapMarkers', async function(req, res) {
            const reqBody = {
                "search":
                    {
                        "mode":"rooms",
                        "min_budget":100,
                        "max_budget":2000,
                        "top_left":"-33.878453691548835,151.16001704415282",
                        "bottom_right":"-33.90481527152859,151.2626705475708"
                    }
            }


    
            let data = await FlatmatesClient.GetListings(reqBody)
    
            console.log("testing map markers")
            console.log('Test page served.')
            res.send(data)
        });
    
    
        // this.app.get('/testAutocomplete', async function(req, res) {
        //     const a = 10
        //     const b = 20
        //     let c = a * b
        //     let str = 'hello world '
    
        //     let json = await app.flatmatesClient.autocomplete("Redfern")
    
        //     res.send(json)
        //     console.log('Test page served.')
        //     console.log(json)
        // });
    
    }

    private api() {

    }
}