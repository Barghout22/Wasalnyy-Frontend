import { Component, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-driver-info-display',
  imports: [],
  templateUrl: './driver-info-display.html',
  styles: ``,
})
export class DriverInfoDisplay {
  @Input() driver:any;
  @Input() tripId:string='';
  @Output() cancelTrip=new EventEmitter<any>();
  

  canceltrip(){
    this.cancelTrip.emit(this.tripId);
  }
  

}
