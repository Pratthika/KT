import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, CustomerProfile } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: CustomerProfile | null = null;
  loading = true;
  error = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
  const id = localStorage.getItem('customerId') || ''; 
  if (!id) {
    this.error = "User not logged in";
    this.loading = false;
    return;
  }

  this.api.getProfile(id).subscribe({
    next: (data) => { this.profile = data; this.loading = false; },
    error: (err) => { this.error = err.message; this.loading = false; }
  });
}
}