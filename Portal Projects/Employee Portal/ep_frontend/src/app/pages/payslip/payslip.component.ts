import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common'; // 1. Import this
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PayslipService, PayslipRecord } from '../../core/services/payslip.service';

@Component({
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  styleUrls: ['./payslip.component.css'],
})
export class PayslipComponent implements OnInit {
  payslip: PayslipRecord | null = null;
  loading = true;
  error = '';

  constructor(private auth: AuthService, private payslipService: PayslipService) {}

  ngOnInit(): void {
    const pernr = this.auth.getPernr();
    this.payslipService.getPayslip(pernr).subscribe({
      next: (res: any) => {
        this.payslip = res.payslip?.[0] || null;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load payslip data.';
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

  maskBankAccount(acct: string): string {
    if (!acct) return '—';
    return '••••' + acct.slice(-4);
  }
}