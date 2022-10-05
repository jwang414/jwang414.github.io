const info = {};
const G_API = "&key=AIzaSyC9udwlUi7lFoB2YPa9zBwWDYC3tHtjxp4";
const YELP_API = "8QcHHs6tX63AN9N80u5hL284BRPTvlTKebHNJIKldN8l_7PBxxwSYK_7GdlFyAh_oHQS0SlLesdT6vHN4gimOB4nQmigbGqKojgBe3ZPazAkpNUd_tSyjiKVfE89Y3Yx";


function getInfo(){
    info['keyword'] = document.getElementById("keyword").value;
    info['category'] = document.getElementById("category").value;
    info['distance'] = document.getElementById("distance").value;
    checkLocation();
    console.log("this function is read"+ JSON.stringify(info))
    
}

function clearInfo(){
    document.getElementById('keyword').value = '';
    document.getElementById('category').value = "default";
    document.getElementById('distance').value = '';
    document.getElementById('locationField').value = '';
    document.getElementById("locationCheck").checked = false;
    info = {};
}

async function locationBox(){
    if (document.getElementById("locationCheck").checked == true){
        document.getElementById("locationField").required = false;
        document.getElementById("locationField").disabled = true;
    }
    else{
        document.getElementById("locationField").required = true;
        document.getElementById("locationField").disabled = false;
    }

}
async function checkLocation(){
    if (document.getElementById("locationCheck").checked == true){
        const request = await fetch("https://ipinfo.io/json?token=032fc8e361cc24")
        const jsonResponse = await request.json()
        info['distance'] = JSON.stringify(jsonResponse.ip);
        console.log(jsonResponse.ip, jsonResponse.country)
        
    }
    else{
        info['location'] = document.getElementById("locationField").value; 
        googleLocation(info['location']);
    }
}

async function googleLocation(location){
    var location_url = location.split(/[ ,]+/);
    
    var request = await fetch("https://maps.googleapis.com/maps/api/geocode/json?address=" + location_url + G_API);
    var jsonResponse = await request.json();
    //var location_info = JSON.parse(jsonResponse);
    
    console.log(JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]));
    
}

