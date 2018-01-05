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

    /**
     * Adds a new HTTP GET endpoint to the Server, allowing the handler method to be externally defined.
     * @param path The endpoint path. Eg. If Server is listening on localhost:3000, and the 
     *             endpoint is to be localhost:3000/hello-world, then the path should be "/helloworld"
     * @param handler An arbitrary function variable or lambda to handle the HTTP request using Express eg.
     *                  function(req, res) {
     *                       res.send("hello world!")
     *                   }
     */
    public addHttpGetEndpoint(path: string, handler: (req: express.Request, res: express.Response) => void ) {
        this.app.get(path, handler)
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