import { Component, OnInit } from '@angular/core';
import { range } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {
  storageReservations: any = []
  haveReservations: boolean = false;
  constructor() { 

  }
  
  ngOnInit(): void {
    for(var i=0; i<localStorage.length; i+=1){
      console.log(localStorage.key(i))
      this.storageReservations.push(localStorage.getItem(i.toString()))
    }
    if (localStorage.length>0){
      this.haveReservations = true;
    }
    else{
      this.haveReservations = false;
    }
  }
  reservationDelete(reservationName:string){
    console.log("delte this reservation")
  }

}
