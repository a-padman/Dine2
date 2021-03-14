var fetch = require("node-fetch");
const geolib = require('geolib');
const usZips = require('us-zips');


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    var body = req.body;

    //zip code 1 -> latitude and longitude (us-zips) -> zip1Response
    //zip code 2 -> latitude and longitude (us-zips) -> zip2Response
    // midpoint lat lon (geolib) -> centerCoords 
    //call azure maps for restaurants

    var zip1 = body.zip1;
    var zip2 = body.zip2;

    var zip1Response = usZips[zip1];
    var zip2Response = usZips[zip2];

    var centerCoords = geolib.getCenterOfBounds([
        { latitude: zip1Response["latitude"], longitude: zip1Response["longitude"] },
        { latitude: zip2Response["latitude"], longitude: zip2Response["longitude"] },
    ]);

    var cuisine = body.cuisine;

    var testResult = await analyzeCoords(centerCoords["latitude"], centerCoords["longitude"], cuisine);
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: testResult
    };

    console.log(testResult);
    context.done(); 
}

//send central coordinates to Azure Maps
async function analyzeCoords(latitude, longitude, cuisine){ 
    
    const subscriptionKey = process.env['map-key']; 
    const uriBase = 'https://atlas.microsoft.com' + '/search/fuzzy/json';

    let params = new URLSearchParams({
        'api-version': '1.0',
        'query': cuisine + ' ' + 'restaurant',
        'subscription-key': subscriptionKey,
        'lat': latitude,
        'lon': longitude,
        'limit': 10
    })

    
    //no body in this request
    //request header was not required
    let resp = await fetch(uriBase + '?' + params.toString(), {
        method: 'GET',  
    })

    let data = await resp.json();
    
    return data; 
}


