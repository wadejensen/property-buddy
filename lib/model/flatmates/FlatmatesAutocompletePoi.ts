export class FlatmatesAutocompletePoi {
    public name: string
    public longTitle: string
    public shortTitle: string
    public lat: number
    public lon: number

    constructor(name: string, longTitle: string, shortTitle: string, lat: number, lon: number) {
        this.name = name
        this.longTitle = longTitle
        this.shortTitle = shortTitle
        this.lat = lat
        this.lon = lon
    }
}