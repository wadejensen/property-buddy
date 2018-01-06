import fetch, {Response} from "node-fetch"
import * as Express from "express"

export class DomainClient {
    async GetListings(domainListingRequestBody: any) {
        
        
        this.getListingsApiCall(domainListingRequestBody)
        
        



        if (data.CurrentResultCount < data.TotalResultCount)
        //console.log(json);

        return {} //this.processDomainListing(json)
    }

    // If the search area were divided evenly into a grid, granularity is 
    // the number of squares / rectangles per side of the grid
    async recurseGridSearchCollect(x1: number, y1: number, x2: number, y2: number, 
                                   granularity: number, query: Function): Promise<[any]> {

        const xmin = Math.min(x1,x2)
        const ymin = Math.min(y1,y2)
        const xmax = Math.max(x1,x2)
        const ymax = Math.max(y1,y2)
      
        const deltaX = (xmax - xmin) / granularity
        const deltaY = (ymax - ymin) / granularity
        
        let searchResults: [any] = [ {} ]
        // Search the grid square by square. If there are too many results in a square, 
        // subdivide the square and recursively search
        for( let y=0; y<granularity; y++) {
            for( let x=0; x<granularity; x++) {
                const topLeftX = xmin + x*deltaX
                const topLeftY = ymin + (y+1)*deltaY
                const bottomRightX = xmin + (x+1)*deltaX
                const bottomRightY = ymin + y*deltaY
                let [result, validSearch] = await query(topLeftX, topLeftY, bottomRightX, bottomRightY)
                if (!validSearch) {
                    result = await this.recurseGridSearchCollect(topLeftX, topLeftY, bottomRightX, bottomRightY, 
                                                                 granularity+1, query)                  
                }
                searchResults.push(result)
            }
        }
        return searchResults
    }

    async getListingsApiCall(domainListingRequestBody) {
        const url = "https://www.domain.com.au/mvc/MarkersJson?"
        const resp: Response = await this.httpPost(url, domainListingRequestBody)
        if ( resp.status !== 200 ) {
            throw Error('domain.com.au markers API responded with HTTP code: ' + resp.status)
        }
        const data: any = await resp.json()
    }

    async httpPost(url: string, reqBody: any): Promise<Response> {
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain',
            'Accept-Encoding': 'gzip,deflate,br'
        };

        const options: any = {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(reqBody),
            redirect: 'follow',

            // The following properties are node-fetch extensions
            follow: 20,
            timeout: 0,         // req/res timeout in ms, it resets on redirect. 0 to disable
            compress: true,     // support gzip/deflate content encoding. false to disable
            size: 0,            // maximum response body size in bytes. 0 to disable
            agent: null         // http(s).Agent instance, allows custom proxy, certificate etc.
        }

        //console.log(reqBody);
        return await fetch(url, options)
    }

    /**
     * This method is fundementally flawed as there can be multiple listings per listing group
     * Also the API response is paged and limited to 100 listing results.
     * @param json
     * @returns {Array.<*>}
     */
    // processDomainListing(json): Listing {
    //     let resultsList = []
    //     json.ListingGroups.forEach(
    //         rawResult => {
    //             let listing = rawResult.Listings[0]
    //             listing.price = this.parsePrice(listing.DisplayablePrice)
    //             resultsList.push(listing)
    //         }
    //     )
    //     return resultsList.filter( result =>  isNaN(result.price) )
    // }

    // parsePrice(stringPrice) {
    //     let sanitisedPrice = ""
    //     // Check if each character is numeric
    //     for (let i = 0; i < stringPrice.length; i++) {
    //         if (stringPrice[i] === '.') break;
    //         if (!isNaN(stringPrice[i])) {
    //             sanitisedPrice += stringPrice[i]
    //         }
    //     }
    // }
}

// https://coderwall.com/p/nilaba/simple-pure-javascript-array-unique-method-with-5-lines-of-code
function removeDuplicates(array: [any]) {
    return array.filter(function (value, index, self) { 
        return self.indexOf(value) === index;
      });
}