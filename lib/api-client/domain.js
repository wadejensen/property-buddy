import fetch from "node-fetch"

class DomainClient {
    async getListings(domainListingRequestBody) {
        const url = 'https://www.domain.com.au/mvc/MarkersJson?'

        const resp = await this.httpPost(url, domainListingRequestBody)
        if ( resp.status !== 200 ) {
            throw Error('domain.com.au markers API responded with HTTP code: ' + resp.status);
        }
        const json = await resp.json();
        //console.log(json);

        return this.processDomainListing(json)
    }

    async httpPost(url, reqBody) {
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain',
            'Accept-Encoding': 'gzip,deflate,br'
        };

        const options = {
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
    processDomainListing(json) {
        let resultsList = []
        json.ListingGroups.forEach(
            rawResult => {
                let listing = rawResult.Listings[0]
                listing.price = this.parsePrice(listing.DisplayablePrice)
                resultsList.push(listing)
            }
        )
        return resultsList.filter( result =>  isNaN(result.price) )
    }

    parsePrice(stringPrice) {
        let sanitisedPrice = "";
        // Check if each character is numeric
        for (let i = 0; i < stringPrice.length; i++) {
            if (stringPrice[i] === '.') break;
            if (!isNaN(stringPrice[i])) {
                sanitisedPrice += stringPrice[i];
            }
        }
    }
}

export default DomainClient