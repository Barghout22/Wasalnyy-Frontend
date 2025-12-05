import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-admin-trips',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderBar],
  templateUrl: './admin-trips.html',
  styleUrls: ['./admin-trips.css'],
})
export class AdminTripsComponent implements OnInit {
  trips: any[] = [];
  tripId: string = '';
  driverId: string = '';
  riderId: string = '';
  phone: string = '';
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  goBack() {
    window.location.href = '/admin';
  }

  // Get trip by ID
  getTripById() {
    if (!this.tripId.trim()) {
      this.message = 'Please enter a trip ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getTripById(this.tripId).subscribe({
      next: (data) => {
        if (data) {
          this.trips = [data];
          this.isLoading = false;
          this.message = `Trip found`;
          this.messageType = 'success';
        } else {
          this.trips = [];
          this.isLoading = false;
          this.message = 'Trip not found';
          this.messageType = 'error';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.trips = [];
        this.message = 'Trip not found';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Get driver trips
  getDriverTrips() {
    if (!this.driverId.trim()) {
      this.message = 'Please enter a driver ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverTrips(this.driverId).subscribe({
      next: (data) => {
        if (data?.trips && Array.isArray(data.trips)) {
          this.trips = data.trips;
          this.currentPage = data.currentPage;
          this.pageSize = data.pageSize;
          this.totalPages = data.totalPages;
          this.message = `Loaded ${data.trips.length} driver trips (Page ${data.currentPage}/${data.totalPages})`;
          this.messageType = 'success';
        } else {
          this.trips = [];
          this.message = 'No trips found';
          this.messageType = 'error';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.trips = [];
        this.message = 'Error loading driver trips';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Get rider trips
  getRiderTrips() {
    if (!this.riderId.trim()) {
      this.message = 'Please enter a rider ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderTrips(this.riderId).subscribe({
      next: (data) => {
        if (data?.trips && Array.isArray(data.trips)) {
          this.trips = data.trips;
          this.currentPage = data.currentPage;
          this.pageSize = data.pageSize;
          this.totalPages = data.totalPages;
          this.message = `Loaded ${data.trips.length} rider trips (Page ${data.currentPage}/${data.totalPages})`;
          this.messageType = 'success';
        } else {
          this.trips = [];
          this.message = 'No trips found';
          this.messageType = 'error';
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.trips = [];
        this.message = 'Error loading rider trips';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Get rider trips by phone
  getRiderTripsByPhone() {
    if (!this.phone.trim()) {
      this.message = 'Please enter a phone number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderTripsByPhone(this.phone).subscribe({
      next: (data) => {
        this.trips = data;
        this.isLoading = false;
        this.message = `Loaded ${data.length} trips for phone: ${this.phone}`;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.trips = [];
        this.message = 'Error loading rider trips by phone';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Clear results
  clearResults() {
    this.trips = [];
    this.tripId = '';
    this.driverId = '';
    this.riderId = '';
    this.phone = '';
    this.message = '';
    this.currentPage = 1;
    this.totalPages = 0;
  }
}