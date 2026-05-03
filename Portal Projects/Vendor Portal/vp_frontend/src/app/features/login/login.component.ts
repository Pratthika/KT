import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  vendorId = '';
  password = '';
  loading = false;
  error = '';
  showPass = false;

  constructor(private auth: AuthService, private router: Router) {}

  login(): void {
    if (!this.vendorId || !this.password) {
      this.error = 'Please enter your Vendor ID and password.';
      return;
    }
    this.loading = true;
    this.error = '';

    this.auth.login(this.vendorId, this.password).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.status === 404
          ? 'Vendor not found. Please check your ID.'
          : 'Login failed. Please verify your credentials.';
      }
    });
  }
}