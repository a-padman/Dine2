var fetch = require("node-fetch");
const geolib = require('geolib');
const usZips = require('us-zips');
// var multipart = require("parse-multipart");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // var boundary = multipart.getBoundary(req.headers['content-type']);
    
    var body = req.body;
  
    // var parts = multipart.Parse(body, boundary);

    //zip code 1 -> latitude and longitude (us-zips) -> zip1Response
    //zip code 2 -> latitude and longitude (us-zips) -> zip2Response
    // midpoint lat lon (geolib) -> centerCoords 
    //call azure maps for restaurants

    var zip1 = '60504';
    var zip2 = '60601';

    var zip1Response = usZips[zip1];
    var zip2Response = usZips[zip2];

    var centerCoords = geolib.getCenterOfBounds([
        { latitude: zip1Response["latitude"], longitude: zip1Response["longitude"] },
        { latitude: zip2Response["latitude"], longitude: zip2Response["longitude"] },
    ]);

    //seattle space needle test coords
    //var lat= 47.620525;
    //var lon= -122.349274;

    var cuisine = "italian";

    var testResult = await analyzeCoords(centerCoords["latitude"], centerCoords["longitude"], cuisine);
    
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: testResult
    };

    console.log(testResult);
    context.done(); 
}

async function analyzeCoords(latitude, longitude, cuisine){ //add lat and long params
    
    const subscriptionKey = process.env['map-key']; //add to function app config before pushing to github
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
        // headers: {
        //     '<HEADER NAME>': '<HEADER VALUE>' 
        // }
    })

    let data = await resp.json();
    
    return data; 
}
// Questions: how to connect user input from front-end to first async function 


