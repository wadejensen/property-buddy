import { FlatmatesClient } from "../../lib/api-client/FlatmatesClient" 
import { expect } from "chai"
import "mocha"

import { format } from "util";


import {sleep} from "../sleep"
import { Listing } from "../../lib/model/Listing";

describe('FlatmatesClient named constructor', async function() {
  this.timeout(5000)
  it('Should get a 52 char session token and 88 char secret.', async () => {
    await FlatmatesClient.Init()
    sleep(2000)
    
    expect(FlatmatesClient.session).to.be.a('string')
    expect(FlatmatesClient.session.length).to.equal(52)

    expect(FlatmatesClient.secret).to.be.a('string')
    expect(FlatmatesClient.secret.length).to.equal(88)

    // Avoid spamming flatmates.com.au too quickly
  })
})

describe('FlatmatesClient named constructor', async function() {
  this.timeout(5000)
  it('Should return a valid client token usable for a GetListings response.', async () => {
    await FlatmatesClient.Init()

    // Add some fuzziness so I'm not always making the same API call and getting tracked by Flatmates
    let fuzziness = Math.random() * 0.01
    const topLeftLat = -33.878453691548835 + fuzziness
    const topLeftLon = 151.16001704415282 + fuzziness
    const bottomRightLat = -33.90481527152859 - fuzziness
    const bottomRightLon = 151.2626705475708 - fuzziness

    const topLeft = format("%s, %s", topLeftLat, topLeftLon)
    const bottomRight = format("%s, %s", bottomRightLat, bottomRightLon)

    var reqBody: any = {
      "search":
          {
              "mode":"rooms",
              "min_budget":100,
              "max_budget":2000,
              // A decent chuck of inner Sydney, Australia
              "top_left": topLeft,
              "bottom_right": bottomRight
          }
    }
    let data: any = await FlatmatesClient.GetListings(reqBody)
    
    // Check some valid listings were returned
    const listingsCount = data.length
    
    expect(listingsCount).to.be.greaterThan(10)

    const tol = 0.9
    // Test at least "tol" proportion of listings returned are valid
    let invalidListingsCount = 0
    for (const listing of data) {
      let nullFieldCount = 0
      if (listing.id){} else { nullFieldCount++}
      if (listing.imageUrl){} else { nullFieldCount++}
      if (listing.lat){} else { nullFieldCount++}
      if (listing.lon){} else { nullFieldCount++}
      if (listing.listingUrl){} else { nullFieldCount++}
      if (listing.price.length){} else { nullFieldCount++}
      if (listing.title){} else { nullFieldCount++}
      if (listing.source){} else { nullFieldCount++}

      if(nullFieldCount > 0) invalidListingsCount++
    }
    expect(invalidListingsCount / listingsCount).to.be.lessThan(tol)
    // Don't sleep here, the check is already quite long
  })
})