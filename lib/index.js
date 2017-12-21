import express from 'express'

import FlatmatesClient from './api-client/flatmates.js'

//require('ssl-root-cas').inject()

let app = express()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

// require('./config')(app);
//
// require('./engine')(app);
//
require('./routes')(app)
require('./routes/test')(app)
require('./api-client')(app)
//
// require('./static')(app);
//
// require('./server')(app);
//

module.exports = app;

console.log("Hello")

