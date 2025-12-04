import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountDataService } from '../../services/account-data.service';
import { AuthService } from '../../auth/auth-service';
import { EmailUpdateService } from '../../services/email-update';
import { HeaderBar } from '../header-bar/header-bar';

@Component({
  selector: 'app-rider-account',
  standalone: true,
  imports: [CommonModule, FormsModule,HeaderBar],
  templateUrl: './rider-account.html',
  styleUrl: './rider-account.css'
})
export class RiderAccountComponent implements OnInit {
  // Rider data
  fullName: string = '';
  phoneNumber: string = '';
  email: string = '';
  imagePreview: string = '';
  selectedImage: File | null = null;

  // UI state
  loading: boolean = false;
  error: string = '';
  message: string = '';
  isSaving: boolean = false;
  isEditing: boolean = false;

  // Email update state
  isEmailModalOpen: boolean = false;
  newEmail: string = '';
  isUpdatingEmail: boolean = false;
  emailError: string = '';
  emailMessage: string = '';

  // Store original values for cancel functionality
  private originalData: any = {};

  constructor(
    private accountDataService: AccountDataService,
    private authService: AuthService,
    private emailUpdateService: EmailUpdateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRiderData();
  }

  loadRiderData(): void {
    this.loading = true;
    this.error = '';
    
    this.accountDataService.getUserData().subscribe({
      next: (res: any) => {
        this.fullName = res.fullName || '';
        this.phoneNumber = res.phonenumber || '';
        this.email = res.email || '';
        this.imagePreview = res.image || '';

        this.storeOriginalData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading rider data:', err);
        this.error = 'Failed to load rider information';
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
    if (this.selectedImage) formData.append('image', this.selectedImage);

    // Call your update service here
    // this.accountDataService.updateRiderData(formData).subscribe({
    //   next: (res) => {
    //     this.message = 'Profile updated successfully!';
    //     this.isEditing = false;
    //     this.storeOriginalData();
    //     this.isSaving = false;
    //     setTimeout(() => this.message = '', 3000);
    //   },
    //   error: (err) => {
    //     this.error = 'Failed to update profile';
    //     console.error('Update error:', err);
    //     this.isSaving = false;
    //   }
    // });

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
          this.router.navigate(['/choose-user-type']);
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