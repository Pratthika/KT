import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  sidebarCollapsed = false;
  isLoginPage = false;
  pageTitle = 'Dashboard';

  private pageTitles: Record<string, string> = {
    '/dashboard': 'Dashboard',
    '/orders':    'Purchase Orders',
    '/goods':     'Goods Receipt',
    '/invoices':  'Invoices',
    '/finance':   'Finance',
    '/payments':  'Payment Ageing',
    '/memos':     'Debit / Credit Memos',
    '/rfq':       'RFQ',
    '/profile':   'My Profile',
  };

  constructor(private router: Router, public auth: AuthService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this.isLoginPage = e.urlAfterRedirects === '/login';
        this.pageTitle = this.pageTitles[e.urlAfterRedirects] || 'Vendor Portal';
      });
  }
}