#               Dine the Distance                          

###               Find restaurant options halfway between you and a friend! 



### About Me 👩‍💻

Hello! My name is Anita Padman, and I'm currently a junior studying Computer Science at the University of Illinois at Chicago!  When I'm not doing school work, my favorite hobbies include golfing, cooking, and painting (I've been doing a lot of paint alongs on Zoom during lockdown).

<img src="C:\Users\User\Downloads\IMG_4767 (1).JPG" style="zoom:20%;" />

​	I'm a HUGE foodie. One of my favorite social activities has always been going out to eat with friends. Unfortunately, this activity often comes with the huge struggle of deciding on a restaurant to visit. There are a couple factors I always take into account when choosing a restaurant: 

1.  Convenience – I have never been one to take a road trip just for the sake of getting some takeout. 

2. Cuisine – I crave Sushi way more often than I would like to admit.

3. That is pretty much it…I am not that picky when it comes to food 😊

   

### What's Dine the Distance?  🚗

​	Dine the Distance is a web application that takes the zip location locations between two points (you and a friend), a restaurant cuisine, and delivers restaurant recommendations at a neutral midpoint location. Each restaurant recommendation is requested from the Azure Maps API and  includes a link to the location’s website, menu, phone number, and address. Dine the Distance provides food locations that are convenient to you and you friends whilst catering to cuisine and taste preferences. It was created to help avoid situations where you and your friends cannot decide on a place to meet up and grab some food.

<img src="C:\Users\User\Desktop\Severless 2021\Flowchart.png" style="zoom:98%;" />



Now we'll go into the steps I took to build this project the necessary details to replicate it in the future:

### Creating the Azure Function App 💻

1. Navigate to the Azure Portal and create a Function App Resource that uses a Node.js runtime stack. 
2. After it has deployed, add an HTTP trigger to your resource. This is where we will be providing the backend code for our application!
3. Before the function can be used, you will want to install the necessary package dependencies. Run “npm init -y” in your terminal to create a package.json file to store your dependencies. Next, install the following dependencies (npm install):
   - node-fetch
     - To make our HTTP requests 
     - https://www.npmjs.com/package/node-fetch#api
   - us-zips
     - To convert user zip code input into latitude and longitude coordinates
     - https://www.npmjs.com/package/us-zips
   - geolib
     - To find the midpoint between two coordinate locations
     - https://www.npmjs.com/package/geolib

### Backend ⚙️

1. Convert zip codes into coordinates and find the midpoint

   ```javascript
   module.exports = async function (context, req) {
       
       var body = req.body;
   
       //zip code 1 -> latitude and longitude (us-zips) -> zip1Response
       //zip code 2 -> latitude and longitude (us-zips) -> zip2Response
       // midpoint lat lon (geolib) -> centerCoords 
   
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
   }
   ```

   ​	Before we can request restaurant data, we will need to find the midpoint between the two zip code locations entered by the user. This is where the us-zips and geolib node packages come in handy! First, convert the user zip code locations into JSON objects that consist of the latitude and longitude of those locations using the usZips function. Next, we will use these coordinates to find the midpoint via geolib.getCenterOfBounds. Lastly, pass in the center latitude, center longitude, and preferred user cuisine into another function (analyzeCoords) to send this data to the Azure Maps API. 

   

2. Request Restaurant Data 

   ```javascript
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
   
      
       let resp = await fetch(uriBase + '?' + params.toString(), {
           method: 'GET'
       })
   
       let data = await resp.json();
       
       return data; 
   }
   ```

   ​	Let us take a closer look at the analyzeCoords (latitude, longitude, cuisine) function. In this function, you will want to populate your URL search parameters and perform a GET request for your response data that we will parse through later for the user to see on the frontend. 

   Refer to the Free Form Search API documentation to add or modify URL parameters: 

   https://docs.microsoft.com/en-us/rest/api/maps/search/getsearchfuzzy

### Frontend ✨

1. Create a form for user input

```html
<div id="container">
		<form onsubmit="handle(event)" enctype="multipart/form-data" >
        	<div class="row">
            	<div class="form-group col-md-6" style="padding-left: 35px;">
                	<input type="text" name="zip1" placeholder="Zip Code 1" required>
                </div>
                <div class="form-group col-md-6 mt-3 mt-md-0">
                	<input type="text" name="zip2" placeholder="Zip Code 2" required>
                </div>
             </div>
             <div class="text-center">
             	<input type="text" name="cuisine" placeholder="Food Cuisine">
             </div>
            <div><button type="submit">Find Food!</button></div>
    	</form>
	<div id="printRestaurant"></div>
</div>
```

​	To capture the user’s location and cuisine information, you will need to create a form in an index.html file. The main elements you will need include 2 inputs, and a submit button that handles the event (conveniently named handle(event) 😊), sends the data to our function app, and parses the JSON result.  

2. Parse the JSON Result

```javascript
  var functionUrl = "blah blah blah"
  const resp = await fetch (functionUrl, {
      method: 'POST',
      body:JSON.stringify({zip1, zip2, cuisine}),
      headers: {
        'Content-Type': 'application/json'
      },
  });

  var data = await resp.json();
  var newData = JSON.stringify(data.results);
  var obj = JSON.parse(newData);
```

​	Lastly, send an object containing the user zip code information and cuisine retrieved from the form and await a JSON response body that can be parsed to populate the frontend with restaurant information that can be displayed to the user. 

### Deploying the Static Web App 🚀

1.  Create a static web app in Azure in the Azure Portal and add the workflow to the master branch of the GitHub repo you have saved all your work
2.  Grab a friend and try a new restaurant with Dine the Distance! 

Here's a link to try out my version: https://calm-moss-0d1a6c110.azurestaticapps.net/

### So what's next? 🔮

​	Dine the Distance has some room for additional features. The next course of action involves utilizing the Twilio API to message all involved parties of friends the address of the restaurant they all agree to meet at. Additionally, each restaurant recommendation will also include a distance tracker in miles between each zip code location to help users visualize how far they will need to drive before making the trip. 

​	Until then....with Dine the Distance, you and your friends can stop aimlessly scrolling on online for restaurants nearby and instead utilize this all-in-one functional web app next time you want to grab a bite! 

### Special Mentions 🤗

​	This project was created as part of the [Bit Project](https://www.bitproject.org/) Serverless BitCamp cohosted by Microsoft. I'd like to thank my mentor Marie Hoeger for answering all my questions and making this project a great learning experience! Additionally, thanks to Emily, Evelyn, and Julia for coordinating our cohort activities and laying out clear expectations throughout the Bit Camp. 

Lastly, the name credit for this app goes out to my dear friend Divya Francis 💖