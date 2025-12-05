import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-admin-riders',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderBar],
  templateUrl: './admin-rider.html',
  styleUrls: ['./admin-rider.css'],
})
export class AdminRidersComponent implements OnInit {
  riders: any[] = [];
  selectedRider: any = null;
  searchPhone: string = '';
  riderId: string = '';
  searchRiderId: string = '';
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  goBack() {
    window.location.href = '/admin';
  }

  // Get all riders
  getAllRiders() {
    this.isLoading = true;
    this.message = '';
    this.adminService.getAllRiders().subscribe({
      next: (data) => {
        console.log(data);
        this.riders = data;
        this.isLoading = false;
        this.message = `Loaded ${data.length} riders`;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading riders';
        this.messageType = 'error';
      }
    });
  }

  // Get rider by phone
  getRiderByPhone() {
    if (!this.searchPhone.trim()) {
      this.message = 'Please enter a phone number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderByPhone(this.searchPhone).subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          this.riders = [data];
          this.isLoading = false;
          this.message = 'Rider found: ' + data.fullName;
          this.messageType = 'success';
        } else {
          this.riders = [];
          this.isLoading = false;
          this.message = 'Rider not found';
          this.messageType = 'error';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.riders = [];
        this.message = 'Rider not found';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Get rider by ID
  getRiderById() {
    if (!this.searchRiderId.trim()) {
      this.message = 'Please enter a rider ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderById(this.searchRiderId).subscribe({
      next: (data) => {
        console.log(data);
        if (data ) {
          // Get the rider info from the first trip
          const riderData = data;
          if (riderData) {
            this.riders = [riderData];
            this.isLoading = false;
            this.message = `Rider found: ${riderData.fullName}`;
            this.messageType = 'success';
          } else {
            this.riders = [];
            this.isLoading = false;
            this.message = 'Rider not found';
            this.messageType = 'error';
          }
        } else {
          this.riders = [];
          this.isLoading = false;
          this.message = 'Rider not found or has no trips';
          this.messageType = 'error';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.riders = [];
        this.message = 'Error finding rider by ID';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Get rider trip count
  getRiderTripCount() {
    if (!this.riderId.trim()) {
      this.message = 'Please enter a rider ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderTripCount(this.riderId).subscribe({
      next: (data) => {
        this.message = `Rider ${data.riderId} has ${data.tripCount} trips`;
        this.messageType = 'success';
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading trip count';
        this.messageType = 'error';
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
          this.riders = data.trips;
          this.isLoading = false;
          this.message = `Loaded ${data.trips.length} trips`;
          this.messageType = 'success';
        } else {
          this.riders = [];
          this.isLoading = false;
          this.message = 'No trips found';
          this.messageType = 'error';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading trips';
        this.messageType = 'error';
      }
    });
  }

  // Get rider trips by phone
  getRiderTripsByPhone() {
    if (!this.searchPhone.trim()) {
      this.message = 'Please enter a phone number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderTripsByPhone(this.searchPhone).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.riders = data;
          this.message = `Loaded ${data.length} trips`;
        } else {
          this.riders = data ? [data] : [];
          this.message = `Loaded ${this.riders.length} trips`;
        }
        this.isLoading = false;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading trips';
        this.messageType = 'error';
      }
    });
  }

  // Get rider complaints by phone
  getRiderComplaintsByPhone() {
    if (!this.searchPhone.trim()) {
      this.message = 'Please enter a phone number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderComplaintsByPhone(this.searchPhone).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.riders = data;
          this.message = `Loaded ${data.length} complaints`;
        } else {
          this.riders = data ? [data] : [];
          this.message = `Loaded ${this.riders.length} complaints`;
        }
        this.isLoading = false;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading complaints';
        this.messageType = 'error';
      }
    });
  }

  // Get rider against complaints by phone
  getRiderAgainstComplaintsByPhone() {
    if (!this.searchPhone.trim()) {
      this.message = 'Please enter a phone number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderAgainstComplaintsByPhone(this.searchPhone).subscribe({
      next: (data: any) => {
        if (Array.isArray(data)) {
          this.riders = data;
          this.message = `Loaded ${data.length} complaints against this rider`;
        } else {
          this.riders = data ? [data] : [];
          this.message = `Loaded ${this.riders.length} complaints against this rider`;
        }
        this.isLoading = false;
        this.messageType = 'success';
      },
      error: (err: any) => {
        this.isLoading = false;
        this.message = 'Error loading complaints';
        this.messageType = 'error';
      }
    });
  }

  // Suspend rider
  suspendRider() {
    if (!this.riderId.trim()) {
      this.message = 'Please enter a rider ID';
      this.messageType = 'error';
      return;
    }
    if (confirm('Are you sure you want to suspend this rider?')) {
      this.isLoading = true;
      this.adminService.suspendRider(this.riderId).subscribe({
        next: (data) => {
          this.message = 'Rider suspended successfully';
          this.messageType = 'success';
          this.isLoading = false;
          this.riderId = '';
        },
        error: (err) => {
          this.isLoading = false;
          this.message = 'Error suspending rider';
          this.messageType = 'error';
        }
      });
    }
  }
}