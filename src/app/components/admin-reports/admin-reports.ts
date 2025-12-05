import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderBar],
  templateUrl: './admin-reports.html',
  styleUrls: ['./admin-reports.css'],
})
export class AdminReportsComponent implements OnInit {
  totalDrivers: number = 0;
  totalRiders: number = 0;
  totalTrips: number = 0;
  complaints: any[] = [];
  complaintId: string = '';
  isLoading: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';
  dashboardLoaded: boolean = false;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.loadDashboardReports();
  }

  goBack() {
    window.location.href = '/admin';
  }

  // Load all dashboard reports
  loadDashboardReports() {
    this.isLoading = true;
    this.message = '';

    // Get total counts
    this.adminService.getTotalCounts().subscribe({
      next: (data) => {
        this.totalDrivers = data.totalDrivers;
        this.totalTrips = data.totalTrips;
        this.isLoading = false;
        this.dashboardLoaded = true;
        this.message = 'Dashboard data loaded successfully';
        this.messageType = 'success';
      },
      error: (err) => {
        console.error('Error loading total counts:', err);
        this.message = 'Error loading dashboard data';
        this.messageType = 'error';
        this.isLoading = false;
      }
    });

    // Get riders count
    this.adminService.getRidersCount().subscribe({
      next: (data) => {
        this.totalRiders = data.totalRiders;
      },
      error: (err) => {
        console.error('Error loading riders count:', err);
      }
    });
  }

  // Refresh dashboard
  refreshDashboard() {
    this.loadDashboardReports();
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
      next: (data) => {
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
      error: (err) => {
        this.isLoading = false;
        this.complaints = [];
        this.message = 'Complaint not found';
        this.messageType = 'error';
        console.error('Error details:', err);
      }
    });
  }

  // Export data as CSV (simulated)
  exportData() {
    const data = {
      totalDrivers: this.totalDrivers,
      totalRiders: this.totalRiders,
      totalTrips: this.totalTrips,
      exportedAt: new Date().toISOString()
    };
    const csv = Object.entries(data)
      .map(([key, value]) => `${key},${value}`)
      .join('\n');
    
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
    element.setAttribute('download', `admin-report-${new Date().getTime()}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    this.message = 'Report exported successfully';
    this.messageType = 'success';
  }
}