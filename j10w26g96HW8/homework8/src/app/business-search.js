
const baseUrl = "https://homework8-try-server.wm.r.appspot.com";
//const baseUrl = "http://localhost:3000";
function clearInfoJS(){
    document.getElementById('keyword').value = "";
    document.getElementById('category').value = "All";
    document.getElementById('distance').value = "10";
    document.getElementById('location').value = "";
    document.getElementById("locationBoxCheck").checked = false;
    document.getElementById("location").required = true;
}

parameters = {}
function mile_to_meters(miles){
  return miles*1609.344;
}

function update_parameters(latitude, longitude){
  parameters['term'] = document.getElementById("keyword").value;
  parameters['category'] = document.getElementById("category").value;
  var meters = mile_to_meters(parseFloat(document.getElementById("distance").value))
  parameters['radius'] = meters;
  parameters['latitude'] = latitude;
  parameters['longitude'] = longitude;
}


async function searchBusiness() {
  var req = new XMLHttpRequest();
  var passed_url = baseUrl + "/search?&terms=" + parameters['term'] + "&radius=" + parameters['radius'] + "&category=" + parameters['category'] + "&latitude=" + parameters['latitude']+ "&longitude=" + parameters['longitude'];
  req.onreadystatechange = function() {
      if (req.readyState==4 && req.status==200){
          businesses_list = JSON.parse(req.responseText);
      }
  }
  req.open("GET", passed_url, false);
  req.send();
  return businesses_list
  
}
async function searchBusiness_Details(business_ID){
  var req = new XMLHttpRequest();
  var passed_url = baseUrl + "/search/details/" + business_ID;
  req.onreadystatechange = function() {
      if (req.readyState==4 && req.status==200){
          businesses_detail = JSON.parse(req.responseText);
      }
  }
  req.open("GET", passed_url, false);
  req.send();
  return businesses_detail;

}

async function getGoogleLocation(locationRaw){
  var locationArray = locationRaw.split(/[ ,]+/);
  var location_url = locationArray.join('+');
  var req = new XMLHttpRequest();
  var passed_url = baseUrl + "/search/googleLocation/" + location_url;
  req.onreadystatechange = function() {
      if (req.readyState==4 && req.status==200){
          location_data = JSON.parse(req.responseText);
      }
  }
  req.open("GET", passed_url, false);
  req.send();
  return location_data;
}

