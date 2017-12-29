import fetch from "node-fetch"

class RealestateClient {
    async getListings(reqBody) {
        const baseUrl = 'https://services.realestate.com.au/services/listings/search?query='

        const url = baseUrl + JSON.stringify(reqBody)

        const resp = await this.httpGet(url)
        if ( resp.status !== 200 ) {
            throw Error('domain.com.au markers API responded with HTTP code: ' + resp.status);
        }
        const json = await resp.json()
        console.log(json)

        return this.processRealestateListing(json)
    }

    async httpGet(url) {
        const headers = {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json, text/plain',
            'Accept-Encoding': 'gzip,deflate,br'
        }

        const options = {
            method: 'GET',
            headers: headers,
            body: "",
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

    processRealestateListing(json) {
        return json
    }
}

export default RealestateClient