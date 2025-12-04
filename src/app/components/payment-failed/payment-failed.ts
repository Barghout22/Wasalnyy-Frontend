import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router} from '@angular/router';
import { PaymentService } from '../../services/payment.service';
@Component({
  selector: 'app-payment-failed',
  imports: [],
  templateUrl: './payment-failed.html',
  styles: ``,
})
export class PaymentFailed {
 paymentId:string|null='';
  paymentAmount:string|null='';
  countdown:number=5;
  
constructor(private route: ActivatedRoute,private router:Router,private paymentService:PaymentService) {}

ngOnInit() {
  this.route.queryParams.subscribe(params => {
    const sessionId = params['session_id'];
    const amount = params['amount'];

    this.paymentId=sessionId;
    this.paymentAmount=amount;
    this.paymentService.updateWallet({TransactionId:sessionId,Status:0,Amount:amount}).subscribe({
      next:res=>{console.log("success")}
    ,error:err=>{console.error(err)}})
    
    const myinterval=setInterval(()=>{
      if(this.countdown===0){
        clearInterval(myinterval);
        this.router.navigate(['/rider-dashboard']);
      }else {
        this.countdown--;
      }
    },1000)
  }) }}
