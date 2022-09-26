const info = {};

function getInfo(){
    info['keyword'] = document.getElementById("keyword").value;
    info['category'] = document.getElementById("category").value;
    info['distance'] = document.getElementById("distance").value;
    checkLocation();
    if (Object.keys(info).length == 4){
        //submit the info to python backend
        alert("this function is read"+ JSON.stringify(info));
    }
}

function clearInfo(){
    document.getElementById('keyword').value = '';
    document.getElementById('category').value = "default";
    document.getElementById('distance').value = '';
    document.getElementById('location').value = '';
    document.getElementById("locationCheck").checked = false;
    info = {};
}

function checkLocation(){
    if (document.getElementById("locationCheck").checked == true){
        document.getElementById("location").required = false;

        fetch("https://ipinfo.io/json?token=032fc8e361cc24").then(
        (response) => response.json()).then((jsonResponse) =>
        info['location'] = String(jsonResponse.city) + "," + String(jsonResponse.region));
    }
    else{
        info['location'] = document.getElementById("location").value; 
    }
}
