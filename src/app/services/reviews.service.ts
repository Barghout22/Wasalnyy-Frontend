import { Injectable } from '@angular/core';
import { environment } from '../../enviroments/enviroment';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth-service';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  apiUrl=environment.apiUrl;
constructor(private authService:AuthService,private httpClient:HttpClient){}
  submitReview(reviewBody:any){
    const token=this.authService.getToken();
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json' 
  });

     const url = `${this.apiUrl}/Reviews/add`;
    return this.httpClient.post(url,reviewBody,{headers});


  }

}
