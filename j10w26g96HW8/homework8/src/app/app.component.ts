import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  inputInfo: any = {}
  autoDetectLocation: boolean = false;
  latitude = ""
  longitude = ""
  G_API = "&key=AIzaSyC9udwlUi7lFoB2YPa9zBwWDYC3tHtjxp4";
  constructor() {
    // Called after the constructor and called  after the first ngOnChanges() 

 }
  ngOnInit(){
    // Called after the constructor and called  after the first ngOnChanges() 
  }
  
}
