import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReqestServices } from '../services/request';

declare function clearInfoJS(): any;
declare function getGoogleLocation(locationRaw: string): any;
declare function searchBusiness(): any;
declare function searchBusiness_Details(business_ID: string): any;
declare function update_parameters(latitude: string, longitude: string): any;


@Component({
  selector: 'app-business-search',
  templateUrl: './business-search.component.html',
  styleUrls: ['./business-search.component.css']
})
export class BusinessSearchComponent implements OnInit{
  inputInfo: any = {};
  infoFormGroup: FormGroup;
  emptyFormGroup: FormGroup;
  ip_Coordinates: any;
  latitude = "";
  longitude = "";
  businessTable: any;
  businessList: any = {};
  businessDetails: any = {};
  businessDetails_photo: any = [];
  businessDetails_photo_first: any;
  businessReviews: any = [];
  headers = ["#", "Image", "Business Name", "Rating", "Distance(miles)"]
  businessTableElement: any;
  
  //reservation form
  reservationFromGroup: FormGroup;
  //checkers
  noKeyword: boolean = false;
  noLocation: boolean = false;
  haveBusinessTable: boolean = false;
  haveBusinessDetails: boolean = false;
  haveNoBusinessTable: boolean = false;

  //google maps
  marker: any = {
    position: {},
  };
  mapOptions: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: false,
    zoom : 13
 }

  ngOnInit() {
    (this._requestService.getIp_Coordinates())
        .subscribe(data => this.ip_Coordinates = data);
  }

  constructor(public fb: FormBuilder, private http: HttpClient, private _requestService: ReqestServices) { 
    this.infoFormGroup = new FormGroup({
      keyword: new FormControl('', [Validators.required]),
      distance: new FormControl(10),
      category: new FormControl('All'),
      location: new FormControl(''),
      locationBoxCheck: new FormControl(false)
    });
    this.emptyFormGroup = this.infoFormGroup.value;
    this.infoFormGroup.controls['keyword'].setValidators([Validators.required]);
    this.infoFormGroup.controls['location'].setValidators([Validators.required]);
    this.businessTableElement = document.getElementById("#businessTable");
    
    //reservation from
    this.reservationFromGroup = new FormGroup({
      email: new FormControl(''),
      date:  new FormControl(''),
      time_hour: new FormControl(''),
      time_min: new FormControl('')
    })
    
    
    /*business = {
      "name": name,
      "url": url,
      "image_url": image_url,
      "rating": rating,
      "distance": distance,
      "id": bus_id
    }; */

  }
  saveReservation(){
    var reservation = this.reservationFromGroup.value;
    reservation["name"] = this.businessDetails['name'];
    localStorage.setItem(this.businessDetails['name'], JSON.stringify(reservation))
  }

  async formSubmit(){
    this.keywordlength();
    this.locationLength();

    if (!this.noKeyword&&!this.noLocation){
      if (this.infoFormGroup.controls['locationBoxCheck'].value == false){
        await this.googleCoordinates()
      }
      else{
        this.ipCoordinates();
      }
      
      update_parameters(this.latitude, this.longitude);
      this.businessList = await searchBusiness().then((data: any) =>{
        return data
      })
      if (this.businessList.length == 0){
        this.haveNoBusinessTable = true
      }
      else{
        this.haveBusinessTable = true;
      }
    }
  }

  async detailsSearch(business_id: any){
    this.businessDetails = await searchBusiness_Details(business_id).then((data: any) =>{
      return data
    })
    //console.log(this.businessDetails);
    this.businessDetails_photo_first = this.businessDetails["image"][0];
    this.businessDetails_photo = this.businessDetails["image"].slice(1,);
    this.haveBusinessDetails = true;
    this.businessReviews = this.businessDetails["all_reviews"];

    this.mapOptions['center'] = {"lat": parseFloat(this.businessDetails["coordinates"][0]), "lng": parseFloat(this.businessDetails["coordinates"][1])};
    this.marker['position'] = {"lat": parseFloat(this.businessDetails["coordinates"][0]), "lng": parseFloat(this.businessDetails["coordinates"][1])};
    //hide business table
    this.haveBusinessTable = false;
  }
  //show business table and hide details
  backbutton(){
    this.haveBusinessTable = true;
    this.haveBusinessDetails = false;
  }


  clearInfo(){
    this.infoFormGroup.reset(this.emptyFormGroup);
    this.noKeyword = false;
    this.noLocation = false;
    this.haveBusinessTable = false;
    this.haveBusinessDetails = false;
    this.haveNoBusinessTable = false;
    this.infoFormGroup.controls['location'].enable();
    clearInfoJS();
  }

  ipCoordinates(){
    var coordinates = this.ip_Coordinates.loc.toString()
    coordinates = coordinates.split(",");
    this.latitude = coordinates[0];
    this.longitude = coordinates[1];

  }
  async googleCoordinates(){
    var coordinates = await getGoogleLocation(this.infoFormGroup.controls['location'].value);
    
    this.latitude = coordinates[0];
    this.longitude = coordinates[1];
  }

  

  locationBox(){
    if (this.infoFormGroup.controls['locationBoxCheck'].value == false){
      this.infoFormGroup.controls['location'].disable()
      this.infoFormGroup.controls['location'].setValue("");
      this.infoFormGroup.controls['location'].clearValidators();

    }
    else{
      this.infoFormGroup.controls['location'].enable()
      this.infoFormGroup.controls['location'].setValidators([Validators.required]);
    }
  }


  keywordlength(){
    if (this.infoFormGroup.controls['keyword'].value.length == 0){
      this.noKeyword = true;
    }
    else{
      this.noKeyword = false;
    }
  }

  locationLength(){
    if (this.infoFormGroup.controls['location'].value.length == 0 && this.infoFormGroup.controls['locationBoxCheck'].value == false){
      this.noLocation = true;
    }
    else{
      this.noLocation = false;
    }
  }

}