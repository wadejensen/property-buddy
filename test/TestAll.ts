import { hello } from "../lib/test" 
import { expect } from 'chai'
import 'mocha'

import fetch from "node-fetch"
import { sleep } from "./sleep";

describe('Mocha testing framework', () => {
  it('Should run a test suite.', () => {
    const result = hello();
    expect(result).to.equal('Hello world!')
  });
});

describe('Do we have network access?', function() {
  this.timeout(5000)
  it('Should not throw a network timeout exception when hitting google.com', async () => {
    const resp = await fetch("https://google.com");
    expect(resp.status).to.equal(200)
  });
});

/** Run application logic tests **/
require("./TestServer")
sleep(3000)
require("./api-client/FlatmatesClient")

// require("./api-client/")
// require("./model/")
// require("./routes/")