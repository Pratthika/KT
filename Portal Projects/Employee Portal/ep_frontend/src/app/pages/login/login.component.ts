import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common'; // 1. Import this
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  pernr = '';
  password = '';
  errorMsg = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    if (!this.pernr || !this.password) {
      this.errorMsg = 'Please enter your Employee ID and Password.';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    this.auth.login(this.pernr, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.status === 'S') {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMsg = res.message;
        }
      },
      error: () => {
        this.loading = false;
        this.errorMsg = 'Server error. Please try again.';
      },
    });
  }
}