info = {};
const G_API = "&key=AIzaSyC9udwlUi7lFoB2YPa9zBwWDYC3tHtjxp4";
var businesses_list = [];


function formInfo(){

    var form = document.getElementById("formFields");
    if (form.checkValidity()) {
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
    
}

function clearInfo(){
    document.getElementById('keyword').value = "";
    document.getElementById('category').value = "all";
    document.getElementById('distance').value = "";
    document.getElementById('locationField').value = "";
    document.getElementById("locationCheck").checked = false;
    document.getElementById("locationField").required = true;
    info = {};
    document.getElementById("businessList").innerHTML = "";
    document.getElementById("infoCard").innerHTML = "";
    business_details = {};
    businesses_list = [];
    document.getElementById("infoCard").style.backgroundColor = "lightgrey";
    document.getElementById("locationField").disabled = false;
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

    }
    else if (document.getElementById("locationField").value !== ''){
        var coordinates = googleLocation(document.getElementById("locationField").value);
    }
    return coordinates;
}

function noInfo(){

    document.getElementById("businessList").innerHTML = `<div style = "text-align: center; width: 600px; height: 20px; background-color: white; margin: auto"><p>No Record has been found</p></div>`;
}
function googleLocation(location){
    var location_url = location.split(/[ ,]+/);

    var req = new XMLHttpRequest();
    var passedURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location_url + G_API;
    req.onreadystatechange = function() {
        if (req.readyState==4 && req.status==200){
            jsonResponse = JSON.parse(req.responseText);
        }
        else{
            noInfo();
        }
    }
    
    req.open("GET", passedURL, false);
    req.send();
    return [
        JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]['lat']), 
        JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]['lng'])
        ]
}

function convertMeterToMiles(meters){
    return Math.round(meters / 1609.34) / 100;
}

var business_details = {};

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
    var req = new XMLHttpRequest();
    var passedURL = "/business_details/" + business_ID;
    req.onreadystatechange = function() {
        if (req.readyState==4 && req.status==200){
            businessesID_details = JSON.parse(req.responseText);
        }
        
    }
    req.open("GET", passedURL, false);
    req.send();

    await createDetailPage(businessesID_details)
}

////////display tables//////
async function createDetailPage(businessesID_details) {
    var detailsPage = "";
    detailsPage += `<h2> ${businessesID_details["name"]}</h2>`;
    detailsPage += ` <br></br> <hr id = "line" > <br></br>`;
    detailsPage += `<table class= "detailsTable">`;
    detailsPage += `<tr><th>Status</th> <th>Category</th> </tr>`;
    if (businessesID_details["status"] == "Closed"){
        detailsPage += `<tr><td id = "hours_status" > <button type="button" id = "closed" disabled>Closed</button></td><td>${businessesID_details["category"]}</td></tr>`;
    }
    else{
        detailsPage += `<tr><td id = "hours_status" > <button type="button" id = "open" disabled>Open now</button></td><td>${businessesID_details["category"]}</td></tr>`;
    }
    
    detailsPage += `<tr> <th>Address</th> <th>Phone Number</th> </tr>`;
    detailsPage += `<tr><td>${businessesID_details["location"]}</td><td>${businessesID_details["phone"]}</td></tr>`;
    detailsPage += `<tr> <th>Transaction Supported</th> <th>Price</th> </tr>`;
    detailsPage += `<tr><td>${businessesID_details["transactions"]}</td><td>${businessesID_details["price"]}</td></tr>`;
    detailsPage += `<tr> <th>More Info</th> </tr>`;
    detailsPage += `<tr><td> <a href="${businessesID_details["url"]}" target="_blank" ><u>Yelp</u></a></td>`;
    detailsPage += `</table>`;
    detailsPage += `<br></br>`;
    detailsPage += `
    <div style="width: 100%; text-align: center; margin: auto; border-spacing: 15px;">
    
        <div class = "threePictures" "><img src="${businessesID_details["image"][0]}" alt="icon"> <p>Photo 1</p></div>
        <div class = "threePictures" "><img src="${businessesID_details["image"][1]}" alt="icon"> <p>Photo 2</p></div>
        <div class = "threePictures" "><img src="${businessesID_details["image"][2]}" alt="icon"> <p>Photo 3</p></div>
        
    <br style="clear: left;"/>
   </div>
   `

    document.getElementById("infoCard").style.backgroundColor = "white";
    document.getElementById("infoCard").style.borderColor = "lightgrey";
    document.getElementById("infoCard").style.borderStyle = "solid";
    document.getElementById("infoCard").style.borderWidth = "2px";

    
    document.getElementById("infoCard").innerHTML = detailsPage;
    document.getElementById('infoCard').scrollIntoView(true);
}

async function createTable(business_list) {
    var table_html = "";
    if (business_list.length == 0) {
        //need to change the bottom -line stuff
        table_html = "<div><h3>No Business have been found</h3></div>";
    }
    else {
        table_html = createHeader();
        
        for (var i = 0; i < business_list.length; i++) {
            var business = business_list[i];
            table_html += (`<tbody> <tr class = \"rowInfo\" >`);
            table_html += ("<td id = \"number_cell\">" + parseInt(i+Number(1))  +"</td>");
            table_html += ("<td><img id= \"image_cell\" src=\"" + business["image_url"] + "\" alt=\"icon\"></td>");
            table_html += (`<td id = "business_cell"> <a href="#infoCard" onclick = "searchDetails('${business["id"]}')">${business['name']}</a></td>`);
            table_html += ("<td id = \"rating_cell\">" + business["rating"] + "</td>");
            table_html += ("<td id = \"distance_cell\">" + convertMeterToMiles(business["distance"]) + "</td>");
            table_html += (`</tr>`);
        }
    }
    table_html += "</tbody></table>"
    document.getElementById("businessList").innerHTML = table_html;
    document.getElementById('businessList').scrollIntoView();
}

function createHeader(){
    var table_headers = ["No", "Image", "Business Name", "Rating", "Distance(miles) "]
    var headers = "<table class= \"sortable\"> <thead> <tr class = \"tableHeader\">";
    for (var i =0; i<table_headers.length; i++){
        headers += `<th> ${table_headers[i]}</th>`;
    }
    headers += "</tr></thead>";
    return headers;

}


