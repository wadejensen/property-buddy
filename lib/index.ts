import * as express from "express"

//require('ssl-root-cas').inject()

//let app = express()

// Get around ZScaler transparent proxy. Do not do this in prod
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const greeting: string = "Hello World"

console.error(greeting)