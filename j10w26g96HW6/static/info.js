info = {};
const G_API = "&key=AIzaSyC9udwlUi7lFoB2YPa9zBwWDYC3tHtjxp4";
var businesses_list = [];


function formInfo(){
    info['keyword'] = document.getElementById("keyword").value;
    info['category'] = document.getElementById("category").value;
    if (document.getElementById("distance").value != ""){
        info['distance'] = document.getElementById("distance").value;
    }
    else{
        info['distance'] = '10';
    }
    
    searchBusiness();
    
}

function clearInfo(){
    document.getElementById('keyword').value = "";
    document.getElementById('category').value = "all";
    document.getElementById('distance').value = "";
    document.getElementById('locationField').value = "";
    document.getElementById("locationCheck").checked = false;
    info = {};
    document.getElementById("businessList").innerHTML = "";
}

function locationBox(){
    if (document.getElementById("locationCheck").checked == true){
        document.getElementById("locationField").required = false;
        document.getElementById("locationField").value = "";
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

function convertMeterToMiles(meters){
    return Math.round(meters / 1609.34) / 100;
}


///////search functions/////
async function searchBusiness() {
    var coordinates = await getLocation();
    info['latitude'] = coordinates[0];
    info['longitude'] = coordinates[1];

    var req = new XMLHttpRequest();
    var passedURL = "/search?keyword=" + info['keyword'] + "&distance=" + info['distance'] + "&category=" + info['category'] + "&latitude=" + info['latitude']+ "&longitude=" + info['longitude'];
    req.onreadystatechange = function() {
        if (req.readyState==4 && req.status==200){
            businesses_list = JSON.parse(req.responseText);
        }
    }
    req.open("GET", passedURL, false);
    req.send();
    await createTable(businesses_list);
}

async function searchDetails(business_ID) {
    // var req = new XMLHttpRequest();
    // var passedURL = "/search?business_ID=" + business_ID;
    // req.onreadystatechange = function() {
    //     if (req.readyState==4 && req.status==200){
    //         businessesID_details = JSON.parse(req.responseText);
    //     }
    // }
    // req.open("GET", passedURL, false);
    // req.send();
    // await createTable(businessesID_details);
    console.log("hello");
}

////////display tables//////
async function createTable(business_list) {
    var table_html = "";
    if (business_list.length == 0) {
        //need to change the bottom -line stuff
        table_html = "<div><h3>No Business have been found</h3></div>";
    }
    else {
        table_html = createHeader();
        // var clickRef = `<a onclick="searchDetails({business["id"]})"</a>`;
        // table_html += (`<td id = "business_cell" <a onclick="searchDetails({business["id"]})"</a> > ${business['name']} </td>`);
        
        
        for (var i = 0; i < business_list.length; i++) {
            var business = business_list[i];
            table_html += (`<tr class = \"rowInfo\" >`);
            table_html += ("<td id = \"number_cell\">" + parseInt(i+Number(1))  +"</td>");
            table_html += ("<td><img id= \"image_cell\" src=\"" + business["image_url"] + "\" alt=\"icon\"></td>");
            table_html += (`<td id = "business_cell" onclick = searchDetails(${business['id']})> ${business['name']} </td>`);
            table_html += ("<td id = \"rating_cell\">" + business["rating"] + "</td>");
            table_html += ("<td id = \"distance_cell\">" + convertMeterToMiles(business["distance"]) + "</td>");
            table_html += `</tr>`;
        }
    }
    table_html += "</table>"
    document.getElementById("businessList").innerHTML = table_html;
}

function createHeader(){
    var table_headers = ["No", "Image", "Business Name", "Rating", "Distance(miles) "]
    var headers = "<table class= \"sortable\"> <tr class = \"tableHeader\">";
    for (var i =0; i<table_headers.length; i++){
        headers += `<th> ${table_headers[i]}</th>`;
    }
    headers += "</tr>";
    return headers;

}

