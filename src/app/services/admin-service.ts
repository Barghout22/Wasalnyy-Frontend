import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'https://localhost:7229/api/admin'; 

  constructor(private http: HttpClient) { }

 
  getAllDrivers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers`);
  }

  getDriverById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/${id}`);
  }

  getDriverByLicense(license: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/license/${license}`);
  }

  getDriverTripCount(driverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/${driverId}/trips/count`);
  }

 

  getDriverSubmittedComplaints(license: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/license/${license}/complaints/submitted`);
  }

  getDriverComplaintsAgainst(license: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/license/${license}/complaints/against`);
  }

  getDriverRating(license: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/drivers/license/${license}/rating`);
  }

  suspendDriver(license: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/drivers/license/${license}/suspend`, {});
  }

  // ============= RIDERS =============
  getAllRiders(): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders`);
  }

  getRiderById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/${id}`);
  }

  getRiderByPhone(phone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/phone/${phone}`);
  }

  getRiderTripCount(riderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/${riderId}/trips/count`);
  }

  getRiderComplaintsByPhone(phone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/phone/${phone}/complaints`);
  }

  getRiderAgainstComplaintsByPhone(phone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/riders/phone/${phone}/complaints/against`);
  }

 

  suspendRider(id: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/riders/${id}/suspend`, {});
  }

  // ============= TRIPS =============
  
  getTripById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trips/${id}`);
  }

  getDriverTrips(driverId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trips/drivertrips/${driverId}`);
  }

  getRiderTrips(riderId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trips/ridertrips/${riderId}`);
  }

  getRiderTripsByPhone(phone: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trips/ridertripsbyphone/${phone}`);
  }

  getTotalCounts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/totals`);
  }

  getRidersCount(): Observable<any> {
    return this.http.get(`${this.apiUrl}/reports/riders/count`);
  }

  getComplaintById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/complaints/${id}`);
  }
}