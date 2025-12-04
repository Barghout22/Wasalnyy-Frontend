import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';
import { AuthService } from '../auth/auth-service';


@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  token:string=''
  apiUrl=environment.apiUrl;
  constructor(private authService:AuthService,private httpClient:HttpClient){
    this.token=this.authService.getToken()!;
      
  }
  MakePayment(amount:number){
    const headers=new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    return this.httpClient.post(`${this.apiUrl}/payment/create-session`,amount,{headers});
  }

   getBalance(){
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.httpClient.get(this.apiUrl+'/Wallet/balance',{headers})
  }
  updateWallet(transactionData:any){
     const headers=new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
    const url=this.apiUrl+'/Payment/handle-rider-payment'
    return this.httpClient.post(url,transactionData,{headers})

  }
  
}
