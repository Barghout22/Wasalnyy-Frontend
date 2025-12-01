import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth-service';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class AccountDataService {
  private ApiUrl=environment.apiUrl;
  private user:any;
  private token:string='';
  private role:string=''
  private headers:HttpHeaders|null=null;
    constructor(private httpClient:HttpClient,private authService:AuthService){
        this.token= this.authService.getToken()!;
        this.role=this.authService.getRole()!;
       this.headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json' 
          });

          }
  updateUser(user:any){
    this.user.next(user);
  }
  getUserData(){
   const url=`${this.ApiUrl}/${this.role}/Profile`;
   this.httpClient.get(url,{headers:this.headers!}).subscribe({next:res=>{
      this.user=res;
    },
      error:err=>{console.error(err)}});
  }
  getDriverData(driverId:string){
    const url=`${this.ApiUrl}/Rider/DriverData`;
    return this.httpClient.post(url, `"${driverId}"`,{headers:this.headers!});
  }
  
  }
