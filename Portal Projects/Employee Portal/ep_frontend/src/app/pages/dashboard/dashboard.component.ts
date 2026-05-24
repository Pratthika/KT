import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { ProfileService } from '../../core/services/profile.service';
import { LeaveService } from '../../core/services/leave.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PayslipService } from '../../core/services/payslip.service';
import { DashboardCardComponent } from '../../shared/dashboard-card/dashboard-card.component'; // ADD THIS

@Component({
  selector: 'app-dashboard',
  standalone: true, // MUST BE TRUE
  imports: [CommonModule, FormsModule, DashboardCardComponent, RouterLink], // ADDED CARD HERE
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  pernr = '';
  fullName = '';
  position = '';
  totalLeaveDays = 0;
  basicPay = 0;
  leaveBalance = 0;
  loading = true;

  constructor(
    private auth: AuthService,
    private profileService: ProfileService,
    private leaveService: LeaveService,
    private payslipService: PayslipService
  ) {}

  ngOnInit(): void {
    this.pernr = this.auth.getPernr();
    this.loadData();
  }

  loadData(): void {
    this.profileService.getProfile(this.pernr).subscribe({
      next: (res: any) => { // ADDED :any
        const p = res.profile?.[0];
        if (p) this.fullName = `${p.VORNA} ${p.NACHN}`;
      },
    });

    this.leaveService.getLeave(this.pernr).subscribe({
      next: (res: any) => { // ADDED :any
        // We also add types to sum and l to fix those "implicitly any" errors
        this.totalLeaveDays = res.leave?.reduce((sum: number, l: any) => sum + (l.ABWTG || 0), 0) || 0;
        this.leaveBalance = res.leave?.[0]?.ANZHL || 0;
      },
    });

    this.payslipService.getPayslip(this.pernr).subscribe({
      next: (res: any) => { // ADDED :any
        const p = res.payslip?.[0];
        if (p) {
          this.basicPay = p.BET01;
          this.position = p.PLANS;
        }
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}