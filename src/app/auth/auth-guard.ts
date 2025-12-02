import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from './auth-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private authService:AuthService) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const token = this.authService.getToken();
    const userRole =this.authService.getRole();


    if (!token||this.authService.CheckTokenExpired(token) ) {
      this.router.navigate(['/choose-user-type']);
      return false;
    }

    const requiredRole = route.data['role'];
    if (requiredRole && userRole !== requiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}