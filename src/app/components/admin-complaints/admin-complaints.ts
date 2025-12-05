import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-admin-complaints',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderBar],
  templateUrl: './admin-complaints.html',
  styleUrls: ['./admin-complaints.css'],
})
export class AdminComplaintsComponent implements OnInit {
  complaints: any[] = [];
  driverLicense: string = '';
  riderPhone: string = '';
  complaintId: string = '';
  searchType: 'driver' | 'rider' | 'complaint' = 'driver';
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  // Map enum values to readable text
  complaintStatusMap: { [key: number]: string } = {
    0: 'Pending',
    1: 'Resolved',
    2: 'Rejected',
    3: 'Dismissed'
  };

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  goBack() {
    window.location.href = '/admin';
  }

  // Helper method to get status text from number
  getStatusText(status: number): string {
    return this.complaintStatusMap[status] || 'Unknown';
  }

  // Change search type and clear results
  changeSearchType(type: 'driver' | 'rider' | 'complaint') {
    this.searchType = type;
    this.clearSearch();
  }

  // Get complaints submitted by driver
  getDriverSubmittedComplaints() {
    if (!this.driverLicense.trim()) {
      this.message = 'Please enter a driver license';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverSubmittedComplaints(this.driverLicense).subscribe({
      next: (data: any) => {
        this.complaints = data;
        this.isLoading = false;
        this.message = `Found ${data.length} complaints submitted by driver`;
        this.messageType = 'success';
      },
      error: (err: any) => {
        this.isLoading = false;
        this.complaints = [];
        this.message = 'Error loading complaints';
        this.messageType = 'error';
        console.error('Error:', err);
      }
    });
  }

  // Get complaints against driver
  getDriverComplaintsAgainst() {
    if (!this.driverLicense.trim()) {
      this.message = 'Please enter a driver license';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getDriverComplaintsAgainst(this.driverLicense).subscribe({
      next: (data: any) => {
        this.complaints = data;
        this.isLoading = false;
        this.message = `Found ${data.length} complaints against driver`;
        this.messageType = 'success';
      },
      error: (err: any) => {
        this.isLoading = false;
        this.complaints = [];
        this.message = 'Error loading complaints';
        this.messageType = 'error';
        console.error('Error:', err);
      }
    });
  }

  // Get complaints submitted by rider
  getRiderComplaints() {
    if (!this.riderPhone.trim()) {
      this.message = 'Please enter a rider phone number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderComplaintsByPhone(this.riderPhone).subscribe({
      next: (data: any) => {
        this.complaints = data;
        this.isLoading = false;
        this.message = `Found ${data.length} complaints from rider`;
        this.messageType = 'success';
      },
      error: (err: any) => {
        this.isLoading = false;
        this.complaints = [];
        this.message = 'Error loading complaints';
        this.messageType = 'error';
        console.error('Error:', err);
      }
    });
  }

  // Get complaints against rider
  getRiderComplaintsAgainst() {
    if (!this.riderPhone.trim()) {
      this.message = 'Please enter a rider phone number';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getRiderAgainstComplaintsByPhone(this.riderPhone).subscribe({
      next: (data: any) => {
        this.complaints = data;
        this.isLoading = false;
        this.message = `Found ${data.length} complaints against rider`;
        this.messageType = 'success';
      },
      error: (err: any) => {
        this.isLoading = false;
        this.complaints = [];
        this.message = 'Error loading complaints';
        this.messageType = 'error';
        console.error('Error:', err);
      }
    });
  }

  // Get complaint by ID
  getComplaintById() {
    if (!this.complaintId.trim()) {
      this.message = 'Please enter a complaint ID';
      this.messageType = 'error';
      return;
    }
    this.isLoading = true;
    this.adminService.getComplaintById(this.complaintId).subscribe({
      next: (data: any) => {
        if (data) {
          this.complaints = [data];
          this.isLoading = false;
          this.message = 'Complaint found';
          this.messageType = 'success';
        } else {
          this.complaints = [];
          this.isLoading = false;
          this.message = 'Complaint not found';
          this.messageType = 'error';
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.complaints = [];
        this.message = 'Complaint not found';
        this.messageType = 'error';
        console.error('Error:', err);
      }
    });
  }

  // Clear search
  clearSearch() {
    this.complaints = [];
    this.message = '';
    this.driverLicense = '';
    this.riderPhone = '';
    this.complaintId = '';
  }
}