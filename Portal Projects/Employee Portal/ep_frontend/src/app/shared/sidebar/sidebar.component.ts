import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ADD THIS
import { RouterModule } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true, // Make sure this is true
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',  route: '/dashboard', icon: '⊞' },
    { label: 'Profile',    route: '/profile',   icon: '◉' },
    { label: 'Leave',      route: '/leave',     icon: '◷' },
    { label: 'Payslip',    route: '/payslip',   icon: '◈' },
    { label: 'Payslip PDF',route: '/payslippdf',icon: '⬡' },
  ];
}