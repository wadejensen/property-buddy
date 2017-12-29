import mongoose from "mongoose"

class Listing {
    constructor() {
        
    }
}

// class Listing {
//     constructor(id, title, source, listingType, lat, lon, address, price,
//                 bedrooms, bathrooms, carspaces, listingUrl, imageUrl) {
//         this.id = id
//         this.title = title
//         this.source = source
//         this.listingType = listingType
//         this.lat = lat
//         this.lon = lon
//         this.price = price
//         this.address = address
//         this.bedrooms = bedrooms
//         this.bathrooms = bathrooms
//         this.carspaces = carspaces
//         this.listingUrl = listingUrl
//         this.imageUrl = imageUrl
//     }
//
//     var Comment = new Schema({
//                                  name: { type: String, default: 'hahaha' },
//                                  age: { type: Number, min: 18, index: true },
//                                  bio: { type: String, match: /[a-z]/ },
//                                  date: { type: Date, default: Date.now },
//                                  buff: Buffer
//                              });
//
//     static fromFlatmatesListing(listing) {
//         const Listing = this.ListingSchema()
//         return
//     }
//

class Listing {
    constructor(json) {
        const ListingSchema = this.SCHEMA
        return new ListingSchema(json)
    }

    static fromFlatmatesListing

    static SCHEMA() {
        return new mongoose.Schema(
            {
                id:             { type: String,     default: "" },
                title:          { type: String,     default: "" },
                listingType:    { type: String,     default: "" },
                lat:            { type: Number,     default: null },
                lon:            { type: Number,     default: null },
                price:          { type: [Number],   default: [null] },
                address:        { type: String,     default: "" },
                bedrooms:       { type: Number,     default: null },
                bathrooms:      { type: Number,     default: null },
                carspaces:      { type: Number,     default: null },
                listingUrl:     { type: String,     default: "" },
                imageUrl:       { type: String,     default: "" }
            })
    }

}



const Listing = new mongoose.Schema(
    {
        id:             { type: String,     default: "" },
        title:          { type: String,     default: "" },
        listingType:    { type: String,     default: "" },
        lat:            { type: Number,     default: null },
        lon:            { type: Number,     default: null },
        price:          { type: [Number],   default: [null] },
        address:        { type: String,     default: "" },
        bedrooms:       { type: Number,     default: null },
        bathrooms:      { type: Number,     default: null },
        carspaces:      { type: Number,     default: null },
        listingUrl:     { type: String,     default: "" },
        imageUrl:       { type: String,     default: "" }
    }
)

export default Listing