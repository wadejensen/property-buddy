import FlatmatesClient from "./flatmates"
import DomainClient from "./domain"

module.exports = async function(app) {
    //console.dir(app)
    try {
        app.flatmatesClient = await FlatmatesClient.create()
    }
    catch (e) {
        console.log(e.message)
        console.log("Could not create flatmates.com.au API client.")
        process.exit(1)
    }
    console.dir(app.flatmatesClient)


    let domainClient = new DomainClient()

    let opts = {
       lat: -33.878453691548835,
       lon: 151.16001704415282,
       radius: 10000.0,
       listingType: "Rent", // valid fields: 'buy', 'rent', 'share'
       // minBed: 0,
       // maxBed: 10,
       // minBath: 0,
       // maxBath: 10,
       // minCar: 0,
       // maxCar: 10,
       // minPrice: 100,
       // maxPrice: 20000,
       //Page: //TODO
       //PageSize: //TODO
    }
    domainClient.getListingsByCenterAndRadius(opts)
}
