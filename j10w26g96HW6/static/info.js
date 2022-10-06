info = {};
const G_API = "&key=AIzaSyC9udwlUi7lFoB2YPa9zBwWDYC3tHtjxp4";


function formInfo(){
    info['keyword'] = document.getElementById("keyword").value;
    info['category'] = document.getElementById("category").value;
    info['distance'] = document.getElementById("distance").value;
    searchBusiness();
    
}

function clearInfo(){
    document.getElementById('keyword').value = '';
    document.getElementById('category').value = "all";
    document.getElementById('distance').value = '';
    document.getElementById('locationField').value = '';
    document.getElementById("locationCheck").checked = false;
    info = {};
}

function locationBox(){
    if (document.getElementById("locationCheck").checked == true){
        document.getElementById("locationField").required = false;
        document.getElementById("locationField").disabled = true;
    }
    else{
        document.getElementById("locationField").required = true;
        document.getElementById("locationField").disabled = false;
    }

}
async function getLocation(){
    if (document.getElementById("locationCheck").checked == true){
        var request = await fetch("https://ipinfo.io/json?token=032fc8e361cc24");
        var jsonResponse = await request.json();
        var coordinates = jsonResponse.loc;
        coordinates = coordinates.split(",");
        // info['latitude'] = coordinates[0];
        // info['longitude'] = coordinates[1];

    }
    else if (document.getElementById("locationField").value !== ''){
        var coordinates = googleLocation(document.getElementById("locationField").value);
    }
    return coordinates;
}

async function googleLocation(location){
    var location_url = location.split(/[ ,]+/);
    
    const request = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + location_url + G_API);
    const jsonResponse = await request.json();
    // info['latitude'] = JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]['lat']);
    // info['longitude'] = JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]['lng']);
    
    return [
        JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]['lat']), 
        JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]['lng'])]
}

var businesses = [];

///////search functions/////

async function searchBusiness() {
    var coordinates = await getLocation();
    info['latitude'] = coordinates[0];
    info['longitude'] = coordinates[1];

    var req = new XMLHttpRequest();
    var passedURL = "/search?keyword=" + info['keyword'] + "&distance=" + info['distance'] + "&category=" + info['category'] + "&latitude=" + info['latitude']+ "&longitude=" + info['longitude'];
    req.onreadystatechange = function() {
        if (req.readyState==4 && req.status==200){
            businesses = JSON.parse(req.responseText);
        }
    }
    req.open("GET", passedURL, false);
    req.send();
}
