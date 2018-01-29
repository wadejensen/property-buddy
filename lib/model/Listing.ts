import {JsonObject, JsonProperty, JsonConverter, JsonCustomConvert} from "json2typescript"
import {NumberToString, StringToNumber} from "./JsonToTypescriptConverters"

// Aliases to clarify the "isOptional" field for property annotations
const OPTIONAL = true
const REQUIRED = false

@JsonObject
export class Listing {

    @JsonProperty("id", String, REQUIRED)   // Flatmates
    public id: string = ""
    
    @JsonProperty("title", String, OPTIONAL)   // Flatmates
    public title: string = ""

    @JsonProperty("source", String, OPTIONAL)
    public source: string = ""
    
    @JsonProperty("listingType", String, OPTIONAL)
    public listingType: string = ""

    @JsonProperty("lat", Number, REQUIRED)     // Flatmates
    public lat: number = NaN

    @JsonProperty("lon", Number, REQUIRED)     // Flatmates
    public lon: number = NaN

    @JsonProperty("price", [Number], REQUIRED)       // Flatmates
    public price: [number] = [NaN]

    @JsonProperty("address", String, OPTIONAL)      // Domain
    public address: string = ""

    @JsonProperty("bedrooms", Number, OPTIONAL)      // Domain
    public bedrooms: number = NaN

    @JsonProperty("bathrooms", Number, OPTIONAL)      // Domain
    public bathrooms: number = NaN

    @JsonProperty("carspaces", Number, OPTIONAL)      // Domain
    public carspaces: number = NaN

    @JsonProperty("listingUrl", String, OPTIONAL)     // Flatmates
    public listingUrl: string = ""

    @JsonProperty("imageUrl", String, OPTIONAL)          // Flatmates
    public imageUrl: string = ""
}
