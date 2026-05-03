import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { VendorService, ProfileRecord } from '../../core/services/vendor.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  loading = true;
  error = '';
  profile: ProfileRecord | null = null;

  constructor(private auth: AuthService, private vendor: VendorService) {}

  ngOnInit(): void {
    this.vendor.getProfile(this.auth.getVendorId()).subscribe({
      next: data => { this.profile = data; this.loading = false; },
      error: () => { this.error = 'Failed to load profile data.'; this.loading = false; }
    });
  }

  get initials(): string {
    if (!this.profile?.WfName1) return '?';
    return this.profile.WfName1.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
  }

  get extraKeys(): string[] {
  if (!this.profile) return [];
  // Add '__metadata' to the known set so it gets ignored
  const known = new Set([
    '__metadata', 
    'WfLifnr', 'Name1', 'Stras', 'Ort01', 
    'Land1', 'Telf1', 'SmtpAddr'
  ]);
  
  return Object.keys(this.profile).filter(k => 
    !known.has(k) && 
    this.profile![k] !== null && 
    typeof this.profile![k] !== 'object' // Safety check to skip objects
  );
}

  get formattedLifnr(): string {
  return this.profile?.WfLifnr?.replace(/^0+/, '') || '';
}
}