import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocationResult } from '../models/location-result';


@Injectable({
  providedIn: 'root'
})
export class LocationSearchService {

  private baseUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  search(query: string): Observable<LocationResult[]> {
    if (!query || query.length < 3) {
      return new Observable<LocationResult[]>(observer => observer.next([]));
    }
    const url = `${this.baseUrl}?format=json&q=${encodeURIComponent(query)}`;
    return this.http.get<LocationResult[]>(url);
  }
}