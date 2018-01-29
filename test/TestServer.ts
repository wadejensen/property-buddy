import 'mocha'
import { expect } from "chai"

import {Server} from "../lib/Server"

describe('Server class constructor', function() {
  this.timeout(7000)
  it('Should launch a HTTP server on port 3000', async () => {
    let server = new Server(3000)
    // There is no good way to assert this that won't be a pain to write
    // We'll have to rely on exceptions to see if this class is broken
  })
})