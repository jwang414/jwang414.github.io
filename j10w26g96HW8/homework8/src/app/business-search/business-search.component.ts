import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReqestServices } from '../services/request';


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
  latitude = ""
  longitude = ""
  
  //checkers
  noKeyword: boolean = false;
  noLocation: boolean = false;

  ngOnInit() {
    (this._requestService.getIp_Coordinates())
        .subscribe(data => this.ip_Coordinates = data);
  }

  constructor(public fb: FormBuilder, private http: HttpClient, private _requestService: ReqestServices) { 
    this.infoFormGroup = new FormGroup({
      keyword: new FormControl(''),
      distance: new FormControl(10),
      category: new FormControl('all'),
      location: new FormControl(''),
      locationBoxCheck: new FormControl(false)
    });
    this.emptyFormGroup = this.infoFormGroup.value;
    this.infoFormGroup.controls['keyword'].setValidators([Validators.required]);
    this.infoFormGroup.controls['location'].setValidators([Validators.required]);

    

  }
  clearInfo(){
    this.infoFormGroup.reset(this.emptyFormGroup);
    this.noKeyword = false;
    this.noLocation = false;
    this.infoFormGroup.controls['location'].enable();
    
  }

  ipCoordinates(){
    
    var coordinates = this.ip_Coordinates.loc.toString()
    coordinates = coordinates.split(",");
    this.latitude = coordinates[0];
    this.longitude = coordinates[1];
    console.log(this.latitude);
    console.log(this.longitude);
  }


  formSubmit(){
    this.keywordlength();
    this.locationLength();
    if (this.noLocation == false && this.noKeyword == false){
      console.log(this.infoFormGroup)
    }
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
