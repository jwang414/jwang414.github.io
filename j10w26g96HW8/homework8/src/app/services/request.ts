import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { ip_Coordinates,  google_Coordinates} from './model';
import { Observable } from 'rxjs';
  
@Injectable({
  providedIn: 'root'
})
export class ReqestServices {
  private iP_INFO_URL = "https://ipinfo.io/json?token=032fc8e361cc24";

  constructor(private httpClient: HttpClient) { }
  
  getIp_Coordinates(): Observable<ip_Coordinates[]>{
    return this.httpClient.get<ip_Coordinates[]>(this.iP_INFO_URL);
  }
}



  /* 
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
}*/
