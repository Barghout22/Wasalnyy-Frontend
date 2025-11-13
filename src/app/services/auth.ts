import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';
import { LoginDto } from '../models/login';
import { RegisterDriverDto } from '../models/register-driver';
import { RegisterRiderDto } from '../models/register-rider';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // 🔹 Login
  login(dto: LoginDto, role?: string): Observable<any> {
    let params = new HttpParams();
    if (role) params = params.set('role', role);

    return this.http.post(`${this.baseUrl}/login`, dto, { params });
  }

  // 🔹 Register Driver
  registerDriver(dto: RegisterDriverDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/driver`, dto);
  }

  // 🔹 Register Rider
  registerRider(dto: RegisterRiderDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register/rider`, dto);
  }

  // 🔹 Save & get token
  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
