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
  headers = ["#", "Image", "Business Name", "Rating", "Distance(miles)"]
  
  //checkers
  noKeyword: boolean = false;
  noLocation: boolean = false;
  haveBusinessTable: boolean = false;
  haveBusinessDetails: boolean = false;
  haveNoBusinessTable: boolean = false;

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
    
    
    /*business = {
      "name": name,
      "url": url,
      "image_url": image_url,
      "rating": rating,
      "distance": distance,
      "id": bus_id
    }; */

  }

  async formSubmit(){
    this.keywordlength();
    this.locationLength();

    if (!this.noKeyword&&!this.noLocation){
      if (this.infoFormGroup.controls['locationBoxCheck'].value == false){
        this.googleCoordinates();
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
    //document.getElementById('businessTable').scrollIntoView();
  }

  async detailsSearch(business_id: any){
    this.businessDetails = await searchBusiness_Details(business_id).then((data: any) =>{
      return data
    })
    console.log(this.businessDetails);
    this.businessDetails_photo_first = this.businessDetails["image"][0];
    this.businessDetails_photo = this.businessDetails["image"].slice(1,);
    this.haveBusinessDetails = true;
  }


  clearInfo(){
    this.infoFormGroup.reset();
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
  googleCoordinates(){
    var coordinates = getGoogleLocation(this.infoFormGroup.controls['location'].value);
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
/*<div *ngIf="haveBusinessTable">
    <table>
        <thead>
        <tr>
            <th *ngFor = "let column of headers">
                {{column}}
            </th>
        </tr>
        </thead>
        <tbody>
            <tr *ngFor="let item of businessList; let i = index">
                <td>{{i}}</td>
                <td>{{item.name}}</td>
                <td>{{item.image_url}}</td>
                <td>{{item.rating}}</td>
                <td>{{item.distance}}</td>
            </tr>
        </tbody>
    </table>
</div> */
