import {JsonObject, JsonProperty, JsonConverter, JsonCustomConvert} from "json2typescript"
import {NumberToString} from "./JsonToTypescriptConverters"

// Aliases to clarify the "isOptional" field for property annotations
const OPTIONAL = true
const REQUIRED = false

@JsonObject
export class Listing {

    @JsonProperty("id", NumberToString, REQUIRED)   // Flatmates
    public id: string = ""

    @JsonProperty("subheading", String, OPTIONAL)   // Flatmates
    public title: string = ""

    @JsonProperty("source", String, OPTIONAL)
    public source: string = ""

    
    public listingType: string = ""

    @JsonProperty("latitude", Number, REQUIRED)     // Flatmates
    public lat: number = NaN

    @JsonProperty("longitude", Number, REQUIRED)     // Flatmates
    public lon: number = NaN

    @JsonProperty("rent", [Number], REQUIRED)       // Flatmates
    public price: [number] = [NaN]

    @JsonProperty("address", String, OPTIONAL)
    public address: string = ""

    @JsonProperty("bedrooms", Number, OPTIONAL)
    public bedrooms: number = NaN

    @JsonProperty("bathrooms", Number, OPTIONAL)
    public bathrooms: number = NaN

    @JsonProperty("carspaces", Number, OPTIONAL)
    public carspaces: number = NaN

    @JsonProperty("listing_link", String, OPTIONAL)     // Flatmates
    public listingUrl: string = ""

    @JsonProperty("photo", String, OPTIONAL)        // Flatmates
    public imageUrl: string = ""
}



// @JsonConverter
// class DateConverter implements JsonCustomConvert<Date> {
//     serialize(date: Date): any {
//         return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +  date.getDate();
//     }
//     deserialize(date: any): Date {
//         return new Date(date);
//     }
// }

// @JsonObject
// export class User {
//     @JsonProperty("date", DateConverter)
//     date: Date = undefined;
// }

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

// class Listing {
//     constructor(json) {
//         const ListingSchema = this.SCHEMA
//         return new ListingSchema(json)
//     }

//     static fromFlatmatesListing

//     static SCHEMA() {
//         return new mongoose.Schema(
//             {
//                 id:             { type: String,     default: "" },
//                 title:          { type: String,     default: "" },
//                 listingType:    { type: String,     default: "" },
//                 lat:            { type: Number,     default: null },
//                 lon:            { type: Number,     default: null },
//                 price:          { type: [Number],   default: [null] },
//                 address:        { type: String,     default: "" },
//                 bedrooms:       { type: Number,     default: null },
//                 bathrooms:      { type: Number,     default: null },
//                 carspaces:      { type: Number,     default: null },
//                 listingUrl:     { type: String,     default: "" },
//                 imageUrl:       { type: String,     default: "" }
//             })
//     }

// }



// const Listing = new mongoose.Schema(
//     {
//         id:             { type: String,     default: "" },
//         title:          { type: String,     default: "" },
//         listingType:    { type: String,     default: "" },
//         lat:            { type: Number,     default: null },
//         lon:            { type: Number,     default: null },
//         price:          { type: [Number],   default: [null] },
//         address:        { type: String,     default: "" },
//         bedrooms:       { type: Number,     default: null },
//         bathrooms:      { type: Number,     default: null },
//         carspaces:      { type: Number,     default: null },
//         listingUrl:     { type: String,     default: "" },
//         imageUrl:       { type: String,     default: "" }
//     }
// )

// export default Listing