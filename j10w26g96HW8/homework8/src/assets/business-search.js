
const G_API = "&key=AIzaSyC9udwlUi7lFoB2YPa9zBwWDYC3tHtjxp4";


function clearInfoJS(){
    document.getElementById('keyword').value = "";
    document.getElementById('category').value = "all";
    document.getElementById('distance').value = "10";
    document.getElementById('location').value = "";
    document.getElementById("locationBoxCheck").checked = false;
    document.getElementById("location").required = true;


    // document.getElementById("businessList").innerHTML = "";
    // document.getElementById("infoCard").innerHTML = "";
    // business_details = {};
    // businesses_list = [];
    // document.getElementById("infoCard").style.backgroundColor = "lightgrey";
    // document.getElementById("locationField").disabled = false;
}
function getGoogleLocation(locationRaw){
    var locationArray = locationRaw.split(/[ ,]+/);
    var location_url = locationArray.join('+');
    var req = new XMLHttpRequest();
    var passedURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + location_url + G_API;
    req.onreadystatechange = function() {
        if (200<=req.status<300 && req.readyState==4){
            jsonResponse = JSON.parse(req.responseText);
        }
    }
    
    req.open("GET", passedURL, false);
    req.send();
    return [
        JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]['lat']), 
        JSON.stringify(jsonResponse["results"][0]["geometry"]["location"]['lng'])
        ]
    
}

/*<div>
    <table mat-table [dataSource]="dataSource" class="mat-elevation-z8">

  <!-- Number Column -->
  <ng-container matColumnDef="numberCol">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by number">
      #
    </th>
    <td mat-cell *matCellDef="let element"> {{element.position}} </td>
  </ng-container>

  <!-- Images Column -->
  <ng-container matColumnDef="imagesCol">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by name">
      Name
    </th>
    <td mat-cell *matCellDef="let element"> {{element.name}} </td>
  </ng-container>

  <!-- Weight Column -->
  <ng-container matColumnDef="businessNameCol">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by weight">
      Business Name
    </th>
    <td mat-cell *matCellDef="let element"> {{element.weight}} </td>
  </ng-container>

  <!-- Symbol Column -->
  <ng-container matColumnDef="ratingCol">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by symbol">
      Rating
    </th>
    <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
  </ng-container>

  <!-- Distance Column -->
  <ng-container matColumnDef="distanceCol">
    <th mat-header-cell *matHeaderCellDef mat-sort-header sortActionDescription="Sort by symbol">
      Distance (miles)
    </th>
    <td mat-cell *matCellDef="let element"> {{element.symbol}} </td>
  </ng-container>

  <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
  <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
</table>
</div> */