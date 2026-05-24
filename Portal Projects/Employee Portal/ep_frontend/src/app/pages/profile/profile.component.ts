import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common'; // 1. Import this
import { FormsModule } from '@angular/forms';
import { ProfileService, ProfileData } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile: ProfileData | null = null;
  loading = true;
  error = '';

  constructor(private auth: AuthService, private profileService: ProfileService) {}

  ngOnInit(): void {
    const pernr = this.auth.getPernr();
    this.profileService.getProfile(pernr).subscribe({
      next: (res) => {
        this.profile = res.profile?.[0] || null;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load profile data.';
        this.loading = false;
      },
    });
  }

  getGenderLabel(code: string): string {
    const map: Record<string, string> = { '1': 'Male', '2': 'Female', '3': 'Non-Binary' };
    return map[code] || code || '—';
  }

  formatDate(sap: string): string {
    if (!sap) return '—';
    // SAP dates can be YYYYMMDD or YYYY-MM-DD
    const clean = sap.replace(/-/g, '');
    if (clean.length === 8) {
      return `${clean.slice(6,8)}/${clean.slice(4,6)}/${clean.slice(0,4)}`;
    }
    return sap;
  }
}