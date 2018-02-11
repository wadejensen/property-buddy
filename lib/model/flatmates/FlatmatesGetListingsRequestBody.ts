import { format } from "util";

export class FlatmatesGetListingsRequestBody {
    constructor(lat1: number, lon1: number, lat2: number, lon2: number,
                mode: string, minPrice: number, maxPrice: number) {
        
        const latMin = Math.min(lat1,lat2)
        const lonMin = Math.min(lon1,lon2)
        const latMax = Math.max(lat1,lat2)
        const lonMax = Math.max(lon1,lon2)
    
        return {
            "search":
                {
                    "mode": mode,
                    "min_budget": minPrice ,
                    "max_budget": maxPrice,
                    "top_left": format("%s, %s", latMax, lonMin),
                    "bottom_right": format("%s, %s", latMin, lonMax)
                }
          }
    }
}