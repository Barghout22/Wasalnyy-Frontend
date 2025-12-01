import { Component,EventEmitter,Input,output,Output } from '@angular/core';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-review-box',
  imports: [FormsModule],
  templateUrl: './review-box.html',
  styleUrl:'./review-box.css'
})
export class ReviewBox {
  @Output() submitReview=new EventEmitter<any>();
  @Input() tripId:string='';
  selectedTripRating:number=0;
  comment:string='';

  setRating(rating:number){
    this.selectedTripRating=rating;
  }

  submit(){
    this.submitReview.emit({
      TripId:this.tripId,
      Comment:this.comment,
      Stars:this.selectedTripRating,
    });
  }
}
