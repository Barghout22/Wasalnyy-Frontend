import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-admin-drivers',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderBar],
  templateUrl: './admin-driver.html',
  styleUrls: ['./admin-driver.css'],
})
export class AdminDriversComponent implements OnInit {
  drivers: any[] = [];
  selectedDriver: any = null;
  searchLicense: string = '';
  driverId: string = '';
  searchDriverId: string = '';
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  // Get driver by ID
getDriverById() {
    if (!this.searchDriverId.trim()) {
      this.message = 'Please enter a driver ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverById(this.searchDriverId).subscribe({
      next: (data: any) => {
        if (data) {
          this.drivers = [data];
          this.isLoading = false;
          this.message = `Driver found: ${data.fullName}`;
          this.messageType = 'success';
        } else {
          this.drivers = [];
          this.isLoading = false;
          this.message = 'Driver not found';
          this.messageType = 'error';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.drivers = [];
        this.message = 'Error finding driver by ID';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }



  goBack() {
    window.location.href = '/admin';
  }

  // Get all drivers
  getAllDrivers() {
    this.isLoading = true;
    this.message = '';
    this.adminService.getAllDrivers().subscribe({
      next: (data) => {
        console.log(data);
        this.drivers = data;
        this.isLoading = false;
        this.message = `Loaded ${data.length} drivers`;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading drivers';
        this.messageType = 'error';
      }
    });
  }

  // Get driver by license
  getDriverByLicense() {
    if (!this.searchLicense.trim()) {
      this.message = 'Please enter a license number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverByLicense(this.searchLicense).subscribe({
      next: (data) => {
        if (data) {
          this.drivers = [data];
          this.isLoading = false;
          this.message = 'Driver found: ' + data.fullName;
          this.messageType = 'success';
        } else {
          this.drivers = [];
          this.isLoading = false;
          this.message = 'Driver not found';
          this.messageType = 'error';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.drivers = [];
        this.message = 'Error: ' + (err.error?.message || 'Driver not found');
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Get driver trip count
  getDriverTripCount() {
    if (!this.driverId.trim()) {
      this.message = 'Please enter a driver ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverTripCount(this.driverId).subscribe({
      next: (data) => {
        this.message = `Driver ${data.driverId} has ${data.tripCount} trips`;
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
        this.drivers = data;
        this.isLoading = false;
        this.message = `Loaded ${data.length} trips`;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading trips';
        this.messageType = 'error';
      }
    });
  }

  // Get submitted complaints
  getSubmittedComplaints() {
    if (!this.searchLicense.trim()) {
      this.message = 'Please enter a license number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverSubmittedComplaints(this.searchLicense).subscribe({
      next: (data) => {
        this.drivers = data;
        this.isLoading = false;
        this.message = `Loaded ${data.length} submitted complaints`;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading complaints';
        this.messageType = 'error';
      }
    });
  }

  // Get complaints against driver
  getComplaintsAgainst() {
    if (!this.searchLicense.trim()) {
      this.message = 'Please enter a license number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverComplaintsAgainst(this.searchLicense).subscribe({
      next: (data) => {
        this.drivers = data;
        this.isLoading = false;
        this.message = `Loaded ${data.length} complaints against driver`;
        this.messageType = 'success';
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading complaints';
        this.messageType = 'error';
      }
    });
  }

  // Get driver rating
  getDriverRating() {
    if (!this.searchLicense.trim()) {
      this.message = 'Please enter a license number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverRating(this.searchLicense).subscribe({
      next: (data) => {
        this.message = `Average rating: ${data.averageRating}`;
        this.messageType = 'success';
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.message = 'Error loading rating';
        this.messageType = 'error';
      }
    });
  }

  // Suspend driver
  suspendDriver() {
    if (!this.searchLicense.trim()) {
      this.message = 'Please enter a license number';
      this.messageType = 'error';
      return;
    }
    if (confirm('Are you sure you want to suspend this driver?')) {
      this.isLoading = true;
      this.adminService.suspendDriver(this.searchLicense).subscribe({
        next: (data) => {
          this.message = 'Driver suspended successfully';
          this.messageType = 'success';
          this.isLoading = false;
          this.searchLicense = '';
        },
        error: (err) => {
          this.isLoading = false;
          this.message = 'Error suspending driver';
          this.messageType = 'error';
        }
      });
    }
  }
}