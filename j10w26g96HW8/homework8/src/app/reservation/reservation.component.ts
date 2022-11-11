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
    for (var i = 0; i < localStorage.length; i++) {
      //console.log(localStorage.key(i));
      var data:any = localStorage.getItem(localStorage.key(i)!) ;
      this.storageReservations.push(JSON.parse(data||null));
    }
    if (localStorage.length>0){
      this.haveReservations = true;
    }
    else{
      this.haveReservations = false;
    }
    console.log(this.storageReservations);
  }
  reservationDelete(reservationName:string){
    for (var i = 0; i < this.storageReservations.length; i++) {
      if (this.storageReservations[i]['name'] == reservationName) {
        this.storageReservations.splice(i, 1);
        localStorage.removeItem(this.storageReservations[i]['name']);
        break;
      }
    }
    alert('Reservation cancelled!');
    if (localStorage.length>0){
      this.haveReservations = false;
    }
  }

}
