import FlatmatesClient from "./flatmates"

module.exports = async function(app) {
    console.dir(app)
    try {
        app.flatmatesClient = await FlatmatesClient.create()
    }
    catch (e) {
        console.log(e.message)
        console.log("Could not create flatmates.com.au API client.")
        process.exit(1)
    }
    console.dir(app.flatmatesClient)
}
