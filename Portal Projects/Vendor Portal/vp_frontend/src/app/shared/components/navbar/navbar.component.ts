import { Component, Input } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';

import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';



@Component({

  selector: 'app-navbar',

  standalone: true,

  imports: [CommonModule, DatePipe],

  templateUrl: './navbar.component.html',

  styleUrls: ['./navbar.component.css']

})

export class NavbarComponent {

  @Input() pageTitle = 'Dashboard';

  today = new Date();



  constructor(private auth: AuthService, private router: Router) {}



  get vendorName(): string { return this.auth.getSession()?.name || ''; }

}