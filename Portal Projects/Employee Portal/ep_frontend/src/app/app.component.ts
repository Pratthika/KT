import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './shared/navbar/navbar.component'; // ADD THIS
import { SidebarComponent } from './shared/sidebar/sidebar.component'; // ADD THIS

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, SidebarComponent], // ADDED COMPONENTS HERE
  templateUrl: './app.component.html',
})
export class AppComponent {
  private router = inject(Router);

  isLoginPage$ = this.router.events.pipe(
    filter((e) => e instanceof NavigationEnd),
    map((e: any) => (e as NavigationEnd).urlAfterRedirects === '/login')
  );
}