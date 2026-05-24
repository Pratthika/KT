import { Component, inject } from '@angular/core'; // Added inject
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  // Inject services immediately at the top
  private auth = inject(AuthService);
  private router = inject(Router);

  // Now 'this.auth' is initialized and safe to use here
  pernr = this.auth.getPernr();

  constructor() {}

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}