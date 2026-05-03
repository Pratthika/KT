import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { FinanceService, FinanceRecord } from '../../core/services/finance.service';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
  loading = true;
  error = '';
  records: FinanceRecord[] = [];
  filtered: FinanceRecord[] = [];
  search = '';

  totalCredit = 0;
  totalDebit  = 0;
  totalPayable = 0;
  constructor(private auth: AuthService, private finance: FinanceService) {}

  ngOnInit(): void {
    this.finance.getFinance(this.auth.getVendorId()).subscribe({
      next: data => {
        console.log('Raw Data from SAP:', data);
        this.records  = data;
        this.filtered = data;
        this.calcTotals(data);
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load finance data.'; this.loading = false; }
    });
  }

  calcTotals(data: FinanceRecord[]): void {
  // Total Credit: Sum of all records where Blart is 'RE' (Invoice)
  this.totalCredit = data
    .filter(r => r.Blart === 'RE')
    .reduce((s, r) => s + (parseFloat(r.Wrbtr) || 0), 0);
    
  // Total Debit: Sum of all records where Blart is 'KG' (Credit Memo)
  this.totalDebit = data
  .filter(r => r.Blart?.toUpperCase() === 'KG') // Force uppercase comparison
  .reduce((sum, r) => sum + (parseFloat(r.Wrbtr) || 0), 0);

  // Total Payable is the difference
  this.totalPayable = this.totalCredit - this.totalDebit;
}

  onSearch(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.records.filter(r =>
      r.Belnr?.toLowerCase().includes(q) ||
      r.Name1?.toLowerCase().includes(q) ||
      r.Blart?.toLowerCase().includes(q)
    );
  }

  formatDate(sapDate: string): string {
    if (!sapDate) return '—';
    const m = sapDate.match(/(\d+)/);
    if (m) return new Date(+m[1]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return sapDate;
  }

  formatAmount(val: string): string {
    const n = parseFloat(val);
    if (isNaN(n)) return val || '—';
    return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
}
