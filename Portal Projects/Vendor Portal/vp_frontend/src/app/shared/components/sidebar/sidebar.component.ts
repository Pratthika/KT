import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

import { CommonModule } from '@angular/common';



interface NavItem {

  label: string;

  icon: string;

  route: string;

}



@Component({

  selector: 'app-sidebar',

  standalone: true,

  imports: [CommonModule, RouterLink, RouterLinkActive],

  templateUrl: './sidebar.component.html',

  styleUrls: ['./sidebar.component.css']

})

export class SidebarComponent {

  @Input() collapsed = false;

  @Output() toggleCollapse = new EventEmitter<void>();



  navItems: NavItem[] = [

    { label: 'Dashboard',       icon: '⬡', route: '/dashboard'  },

    { label: 'Purchase Orders', icon: '📋', route: '/orders'     },

    { label: 'Goods Receipt',   icon: '📦', route: '/goods'      },

    { label: 'Invoices',        icon: '🧾', route: '/invoices'   },

    { label: 'Finance',         icon: '💳', route: '/finance'    },

    { label: 'Payments',        icon: '💰', route: '/payments'   },

    { label: 'Memos',           icon: '📝', route: '/memos'      },

    { label: 'RFQ',             icon: '📊', route: '/rfq'        },

    { label: 'Profile',         icon: '👤', route: '/profile'    },

  ];



  constructor(private auth: AuthService, private router: Router) {}



  get vendorName(): string { return this.auth.getSession()?.name || 'Vendor'; }

  get vendorId():   string { return this.auth.getSession()?.vendorId || ''; }



  logout(): void {

    this.auth.logout();

    this.router.navigate(['/login']);

  }

}