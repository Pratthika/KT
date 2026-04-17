import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public router: Router, private api: ApiService) {}

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get customerId(): string {
    return localStorage.getItem('customerId') || '';
  }

  logout() {
    this.api.logout();
    this.router.navigate(['/login']);
  }
}