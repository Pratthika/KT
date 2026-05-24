import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common'; // 1. Import this
import { FormsModule } from '@angular/forms';
import { LeaveService, LeaveRecord } from '../../core/services/leave.service';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./leave.component.css'],
})
export class LeaveComponent implements OnInit {
  leaves: LeaveRecord[] = [];
  loading = true;
  error = '';

  constructor(private auth: AuthService, private leaveService: LeaveService) {}

  ngOnInit(): void {
    const pernr = this.auth.getPernr();
    this.leaveService.getLeave(pernr).subscribe({
      next: (res: any) => {
        this.leaves = res.leave || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load leave records.';
        this.loading = false;
      },
    });
  }

  formatDate(sap: string): string {
    if (!sap) return '—';
    const clean = sap.replace(/-/g, '');
    if (clean.length === 8) {
      return `${clean.slice(6,8)}/${clean.slice(4,6)}/${clean.slice(0,4)}`;
    }
    return sap;
  }

  get totalDays(): number {
    return this.leaves.reduce((sum, l) => sum + (l.ABWTG || 0), 0);
  }

  get leaveBalance(): number {
    return this.leaves[0]?.ANZHL || 0;
  }
}