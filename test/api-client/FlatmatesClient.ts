import { FlatmatesClient } from "../../lib/api-client/FlatmatesClient" 
import { expect } from "chai"
import "mocha"

import { format } from "util";


import {sleep} from "../sleep"
import { Listing } from "../../lib/model/Listing";
import { FlatmatesAutocompletePoi } from "../../lib/model/flatmates/FlatmatesAutocompletePoi";

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
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

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


describe('FlatmatesClient autocomplete API', async function() {
  this.timeout(5000)
  it('Should return a known list of results when starting to type \"Redfern\"', async () => {
    await FlatmatesClient.Init()
    sleep(2000)
    
    let resp: any = await FlatmatesClient.Autocomplete("Redfe")
    expect(resp).to.deep.equal(
      [
        {
          lat:-33.892215,
          lon:151.205873,
          longTitle:"Redfern, Sydney, NSW, 2016",
          name:"Redfern",
          shortTitle:"Redfern, 2016"
        },
        {
          lat:-33.89334,
          lon:151.20461,
          longTitle:"Redfern, Sydney, NSW, 2015",
          name:"Redfern",
          shortTitle:"Redfern, 2015"
        },
        {
          lat:-33.009833,
          lon:151.7151801,
          longTitle:"Redhead, Newcastle, NSW, 2290",
          name:"Redhead",
          shortTitle:"Redhead, 2290"
        },
        {
          lat:-33.8916355,
          lon:151.1987696,
          longTitle:"Redfern Station, Sydney, NSW, 2015",
          name:"Redfern Station",
          shortTitle:"Redfern Station"
        },
        {
          lat:-25.9399005,
          lon:147.4099991,
          longTitle:"Redford, QLD, 4467",
          name:"Redford",
          shortTitle:"Redford, 4467"
        }
      ].map( (poi: any) => 
        new FlatmatesAutocompletePoi( poi.name, poi.longTitle, poi.shortTitle, poi.lat, poi.lon )
    ))
  })
})
