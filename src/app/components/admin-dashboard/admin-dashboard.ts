import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin-service';
import { CommonModule } from '@angular/common';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule,HeaderBar],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {

  constructor(private adminService: AdminService) { }

  ngOnInit() {
  }

  goToDrivers() {
    // Navigate to drivers page
    window.location.href = '/admin/drivers';
  }

  goToRiders() {
    // Navigate to riders page
    window.location.href = '/admin/riders';
  }

  goToTrips() {
    // Navigate to trips page
    window.location.href = '/admin/trips';
  }

  goToReports() {
    // Navigate to reports page
    window.location.href = '/admin/reports';
  }
}