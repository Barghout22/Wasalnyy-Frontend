import { VehicleDto } from './../../models/vehicle';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountDataService } from '../../services/account-data.service';
import { AuthService } from '../../auth/auth-service';
import { EmailUpdateService } from '../../services/email-update';
import { HeaderBar } from '../header-bar/header-bar';
@Component({
  selector: 'app-driver-account',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderBar],
  templateUrl: './driver-account.html',
  styleUrl: './driver-account.css'
})
export class DriverAccountComponent implements OnInit {
  // Personal data
  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  imagePreview: string = '';
  selectedImage: File | null = null;

  // Vehicle data
  vehicleModel: string = '';
  vehiclePlate: string = '';
  color: string = '';
  make: string = '';
  year: number | null = null;
  capacity: string = '';

  
  loading: boolean = false;
  error: string = '';
  message: string = '';
  isSaving: boolean = false;
  isEditing: boolean = false;
  
  //email
  isEmailModalOpen: boolean = false;
  newEmail: string = '';
  isUpdatingEmail: boolean = false;
  emailError: string = '';
  emailMessage: string = '';

  // Store original values for cancel functionality
  private originalData: any = {};

  capacityOptions = [1, 2, 3, 4, 5, 6, 7, 8];
  currentYear = new Date().getFullYear();

  constructor(
    private accountDataService: AccountDataService,
    private authService: AuthService,
    private emailUpdateService: EmailUpdateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDriverData();
  }

  loadDriverData(): void {
    this.loading = true;
    this.error = '';
    
    this.accountDataService.getUserData().subscribe({
      next: (res: any) => {
       
        this.fullName = res.fullName || '';
        this.phoneNumber = res.phoneNumber || '';
        this.email = res.email || '';
        this.imagePreview = res.image || '';

        // Vehicle data
        this.vehicleModel = res.vehicle.model || '';
        this.vehiclePlate = res.vehicle.plateNumber|| '';
        this.color = res.vehicle.color || '';
        this.make = res.vehicle.make || '';
        this.year = res.vehicle.year || null;
        this.capacity = res.vehicle.capacity || '';

        this.storeOriginalData();
        this.loading = false;
        },
      error: (err) => {
        console.error('Error loading driver data:', err);
        this.error = 'Failed to load driver information';
        this.loading = false;
      }
    });
  }

  storeOriginalData(): void {
    this.originalData = {
      fullName: this.fullName,
      phoneNumber: this.phoneNumber,
      email: this.email,
      imagePreview: this.imagePreview,
      vehicleModel: this.vehicleModel,
      vehiclePlate: this.vehiclePlate,
      color: this.color,
      make: this.make,
      year: this.year,
      capacity: this.capacity,
      selectedImage: this.selectedImage
    };
  }

  toggleEditMode(): void {
    if (this.isEditing) {
      this.cancelEdit();
    } else {
      this.isEditing = true;
      this.message = '';
      this.error = '';
    }
  }

  cancelEdit(): void {
    this.fullName = this.originalData.fullName;
    this.phoneNumber = this.originalData.phoneNumber;
    this.email = this.originalData.email;
    this.imagePreview = this.originalData.imagePreview;
    this.vehicleModel = this.originalData.vehicleModel;
    this.vehiclePlate = this.originalData.vehiclePlate;
    this.color = this.originalData.color;
    this.make = this.originalData.make;
    this.year = this.originalData.year;
    this.capacity = this.originalData.capacity;
    this.selectedImage = this.originalData.selectedImage;
    this.isEditing = false;
    this.error = '';
    this.message = '';
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select a valid image file';
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        this.error = 'Image size must be less than 5MB';
        return;
      }

      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      this.error = '';
    }
  }

  saveChanges(): void {
    this.isSaving = true;
    this.error = '';
    this.message = '';

    const formData = new FormData();
    
    // Only add fields that have been changed or filled
    if (this.fullName.trim()) formData.append('fullName', this.fullName);
    if (this.phoneNumber.trim()) formData.append('phoneNumber', this.phoneNumber);
    if (this.vehicleModel.trim()) formData.append('vehicleModel', this.vehicleModel);
    if (this.vehiclePlate.trim()) formData.append('vehiclePlate', this.vehiclePlate);
    if (this.color.trim()) formData.append('color', this.color);
    if (this.make.trim()) formData.append('make', this.make);
    if (this.year) formData.append('year', this.year.toString());
    if (this.capacity) formData.append('capacity', this.capacity);
    if (this.selectedImage) formData.append('image', this.selectedImage);

 

    // For now, show success
    this.message = 'Profile updated successfully!';
    this.isEditing = false;
    this.storeOriginalData();
    this.isSaving = false;
    setTimeout(() => this.message = '', 3000);
  }

  // Email update methods
  openEmailModal(): void {
    this.newEmail = '';
    this.emailError = '';
    this.emailMessage = '';
    this.isEmailModalOpen = true;
  }

  closeEmailModal(): void {
    this.isEmailModalOpen = false;
    this.newEmail = '';
    this.emailError = '';
    this.emailMessage = '';
  }

  updateEmail(): void {
    this.emailError = '';
    this.emailMessage = '';

    // Validate email
    if (!this.newEmail.trim()) {
      this.emailError = 'Please enter a new email';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.newEmail)) {
      this.emailError = 'Invalid email format';
      return;
    }

    if (this.newEmail === this.email) {
      this.emailError = 'New email must be different from current email';
      return;
    }

    this.isUpdatingEmail = true;

    this.emailUpdateService.updateEmail(this.newEmail).subscribe({
      next: (res) => {
        this.emailMessage = 'Email updated successfully! Redirecting to login...';
        setTimeout(() => {
          this.authService.logout();
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        console.error('Email update error:', err);
        this.emailError = err.error?.message || 'Failed to update email. Please try again.';
        this.isUpdatingEmail = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}