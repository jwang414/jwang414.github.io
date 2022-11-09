const YELP_API = "Bearer 8QcHHs6tX63AN9N80u5hL284BRPTvlTKebHNJIKldN8l_7PBxxwSYK_7GdlFyAh_oHQS0SlLesdT6vHN4gimOB4nQmigbGqKojgBe3ZPazAkpNUd_tSyjiKVfE89Y3Yx";
const BUSINESS_ENDPOINT = "https://api.yelp.com/v3/businesses/search";
const DETAILS_ENDPOINT = "https://api.yelp.com/v3/businesses/";
const HEADERS = {'Authorization': YELP_API};
const G_API = "&key=AIzaSyA77sRAHkT4fcBoH-3R7UAAxOEcGoXAX3s";
parameters = {};

const express = require('express')
const http = require('http');
const path = require('path')
const axios = require('axios');

const app = express()

//const cors = require('cors');
// const { json } = require('express');

// app.use(cors());

var bodyParser = require("body-parser");
const { range } = require('rxjs');

var distDir = __dirname + "/dist/homework8/";

const port = parseInt(process.env.PORT) || 3000;

app.use(express.static(distDir));

app.get('/', (req,res) => res.sendFile(path.join(__dirname)));
app.get('/searches', (req,res) => res.sendFile(path.join(__dirname)));

module.exports = app;
//business search endpoint







const search = express.Router();
app.use('/search', search);
search.route('').get(async (req, res) => {
  var search_result;
  try {
    get_parameters(req.url);
    search_result = await search_Business(res);
  }
  catch(error){
    console.log(error);
    return res.status(400).json({
      message: 'Failed to get search results'
    });  
  }
  try{
    search_result = business_parse(search_result['data']);
    return res.status(200).json(search_result);
  }
  catch(error){
    console.log(error);
    return res.json([]);
  }
})

//details endpoint
search.route('/details/:businessId').get(async (req, res) =>{
  var businessId = req.params.businessId;
  var details;
  var reviews;
  try{
    details = await search_Business_details(businessId)
  } catch(error){
      console.log(error);
      return res.status(400).json({
          message: 'Failed to get business details'
      });      
  }
  try{
    reviews = await search_Business_reviews(businessId)
  } catch(error){
      console.log(error);
      return res.status(400).json({
          message: 'Failed to get business details'
      });      
  }

  //parsing data and reviews
  try{
    details_reviews = details_parse(details['data']);
    details_reviews["all_reviews"] = reviews_parse(reviews['data'])
    return res.status(200).json(details_reviews);
  }
  catch(error){
    console.log(error);
    return res.json([]);
  }
})
//search google
search.route('/googleLocation/:location').get(async (req, res) =>{
  var location = req.params.location;
  var coordinates;
  try{
    coordinates = await getGoogleLocation(location)
  } catch(error){
      console.log(error);
      return res.status(400).json({
          message: 'Failed to get business details'
      });      
  }
  try{
    return res.status(200).json(coordinates);
  }
  catch(error){
    console.log(error);
    return res.json([]);
  }
})


server.listen(port, () => console.log('http://localhost:3000/'));

//helper functions//
function convert_meters_to_miles(miles){
  if (Math.round(miles/1609.344) <1) {
    return 1
  }
  return Math.round(miles/1609.344);
}


function get_parameters(url){
  var urlParams = new URLSearchParams(url);
  parameters['term'] = urlParams.get('terms');
  parameters['radius']= parseInt(urlParams.get('radius'));
  parameters['categories'] = urlParams.get('category');
  parameters['latitude'] = parseFloat(urlParams.get('latitude'));
  parameters['longitude'] = parseFloat(urlParams.get('longitude'));
}

//regular business search
async function search_Business(){
  var business_result = await axios({
    method: 'get',
    url: BUSINESS_ENDPOINT,
    headers: HEADERS,
    params: parameters
  })
  .then(data => {
    return data
  })
  .catch(function (error) {
    console.log(error);
  })
  return business_result;
}

//details search 
async function search_Business_details(business_ID){
  var details_result = await axios({
    method: 'get',
    url: DETAILS_ENDPOINT + business_ID,
    headers: HEADERS,
  })
  .then(data => {
    return data
  })
  .catch(function (error) {
    console.log(error);
  })
  
  return details_result;
}

//reviews
async function search_Business_reviews(business_ID){
  var details_result = await axios({
    method: 'get',
    url: DETAILS_ENDPOINT + business_ID + "/reviews",
    headers: HEADERS,
  })
  .then(data => {
    return data
  })
  .catch(function (error) {
    console.log(error);
  })
  
  return details_result;
}
async function getGoogleLocation(location){
  var gURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location + G_API;
  var location_result = await axios({
    method: 'get',
    url: gURL,
  })
  .then(data => {
    return data['data']
  })
  .catch(function (error) {
    console.log(error);
  })
  return [
    JSON.stringify(location_result["results"][0]["geometry"]["location"]['lat']), 
    JSON.stringify(location_result["results"][0]["geometry"]["location"]['lng'])]
}


function business_parse(received_data) {
  var bus_id, business, business_list, distance, image_url, name, rating, url;
  business_list = [];

  for (var b, i = 0, _pj_a = received_data["businesses"], _pj_b = _pj_a.length; i < _pj_b; i += 1) {
    b = _pj_a[i];

    try {
      name = b["name"];
    } catch (e) {
      name = "";
    }

    try {
      bus_id = b["id"];
    } catch (e) {
      bus_id = "";
    }

    try {
      url = b["url"];
    } catch (e) {
      url = "";
    }

    try {
      image_url = b["image_url"];
    } catch (e) {
      image_url = "";
    }

    try {
      rating = b["rating"];
    } catch (e) {
      rating = "";
    }

    try {
      distance = convert_meters_to_miles(b["distance"]);
    } catch (e) {
      distance = parameters['radius'];
    }

    business = {
      "name": name,
      "url": url,
      "image_url": image_url,
      "rating": rating,
      "distance": distance,
      "id": bus_id
    };
    business_list.push(business);
  }

  return business_list;
}
function reviews_parse(reviews_data) {
  var all_reviews = [];
  for (var i =0; i<reviews_data["reviews"].length; i+=1){
    var name, rating, review, time;
    currReview = {};
    curr = reviews_data["reviews"][i];
    try {
      name = curr["user"]["name"];
    } catch (e) {
      name = "";
    }
    try {
      review = curr["text"];
    } catch (e) {
      review = "";
    }
    try {
      time = curr["time_created"];
    } catch (e) {
      time = "";
    }
    try {
      rating = curr["rating"];
    } catch (e) {
      rating = "";
    }
    currReview = {
      "name": name,
      "review": review,
      "time": time,
      "rating": rating,
    };
    all_reviews.push(currReview)
  }
  return all_reviews;
}
function details_parse(details_data) {
  var category, details, image, location, name, phone, price, status, temp_cat, transactions, url, coordinates;
  details = {};

  try {
    status = details_data["hours"]["is_open_now"];

    if (status === false) {
      status = "Closed";
    } else {
      status = "Open Now";
    }
  } catch (e) {
    status = "";
  }

  try {
    name = details_data["name"];
  } catch (e) {
    name = "";
  }

  try {
    location = details_data["location"]["address1"];
    location += " " + details_data["location"]["city"];
    location += " " + details_data["location"]["zip_code"];
    location += "," + details_data["location"]["state"];
    location += " " + details_data["location"]["country"];
  } catch (e) {
    location = "";
  }

  try {
    price = details_data["price"];
  } catch (e) {
    price = "";
  }

  try {
    phone = details_data["display_phone"];
  } catch (e) {
    phone = "";
  }

  try {
    temp_cat = [];

  for (var cat, i = 0; i < details_data["categories"].length; i += 1) {
    cat = details_data["categories"][i];
    temp_cat.push(cat["title"]);
  }
    category = temp_cat.join(" | ");
  } catch (e) {
    category = "";
  }

  try {
    transactions = " ".join(details_data["transactions"]);
  } catch (e) {
    transactions = "";
  }

  try {
    phone = details_data["display_phone"];
  } catch (e) {
    phone = "";
  }

  try {
    image = details_data["photos"];
  } catch (e) {
    image = "";
  }

  try {
    url = details_data["url"];
  } catch (e) {
    url = "";
  }
  try {
    var coordinatesRaw = details_data["coordinates"];
    coordinates = [coordinatesRaw["latitude"], coordinatesRaw["longitude"]]
  } catch (e) {
    coordinates = [];
  }

  details["status"] = status;
  details["location"] = location;
  details["name"] = name;
  details["price"] = price;
  details["phone"] = phone;
  details["category"] = category;
  details["transactions"] = transactions;
  details["image"] = image;
  details["url"] = url;
  details["coordinates"] = coordinates;
  return details;
}




