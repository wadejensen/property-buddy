class DomainListingRequestBody {
    constructor(opts) {
        return {
            "ListingType":this.listingTypeToEnum(opts.listingType),
            "MinBedrooms": opts.minBed || null,
            "MaxBedrooms": opts.maxBed || null,
            "MinBathrooms": opts.minBath || null,
            "MaxBathrooms": opts.maxBath || null,
            "MinCarspaces": opts.minCar || null,
            "MaxCarspaces": opts.maxCar || null,
            "MinPrice": opts.minPrice || null,
            "MaxPrice": opts.maxPrice || null,
            "MinLandArea": null,
            "MaxLandArea": null,
            "AdvertiserIds":null,
            "PropertyTypes":[],
            "PropertyFeatures":[],
            "Locations":[],
            "LocationTerms":"",
            "Keywords":[],
            "Sort":null,
            "DisplayMap":true,
            "Page":2,
            "PageSize":20,
            "GeoWindow":{
                "Box":{
                    "TopLeft":{
                        "Lat": opts.lat1,
                        "Lon": opts.lon1
                    },
                    "BottomRight":{
                        "Lat": opts.lat2,
                        "Lon": opts.lon2
                    }
                }
            },
            "HasAmbiguousTerm":false,
            "IncludeSurroundingSuburbs":false,
            "SchoolId":null,
            "UpdatedSince":null,
            "ListingAttributes":[]
        }
    }

    listingTypeToEnum(type) {
        switch(type) {
            case 'Buy': return 0;
            case 'Rent': return 1;
            case 'Share': return 2;
            default: throw Error('Unsupported listing type!');
        }
    }
}

export default DomainListingRequestBody