import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
@Component({
  selector: 'app-business-search',
  templateUrl: './business-search.component.html',
  styleUrls: ['./business-search.component.css']
})
export class BusinessSearchComponent implements OnInit{
  inputInfo: any = {};
  infoFormGroup: FormGroup;
  emptyFormGroup: FormGroup;
  //checkers
  noKeyword: boolean = false;

  async ngOnInit() {
    
  }

  constructor(public fb: FormBuilder) { 
    this.infoFormGroup = new FormGroup({
      keyword: new FormControl(''),
      distance: new FormControl(10),
      category: new FormControl('all'),
      location: new FormControl(''),
      locationBoxCheck: new FormControl(false)
    });
    this.emptyFormGroup = this.infoFormGroup.value;

  }
  clearInfo(){
    this.infoFormGroup.reset(this.emptyFormGroup);
    this.noKeyword = false;
    
  }

  formSubmit(){
    this.keywordlength();
    if (this.noKeyword == false){
      console.log(this.infoFormGroup)
      console.log(this.infoFormGroup.controls['keyword'].value.length)
    }
  }

  locationBox(){
    if (this.infoFormGroup.controls['locationBoxCheck'].value == true){
      this.infoFormGroup.controls['location'].disable()
    }
    else{
      this.infoFormGroup.controls['location'].enable()
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

}
