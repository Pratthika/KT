import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { VendorService, PayageRecord } from '../../core/services/vendor.service';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  loading = true;
  error = '';
  records: PayageRecord[] = [];
  filtered: PayageRecord[] = [];
  search = '';
  totalPaid = 0;

  constructor(private auth: AuthService, private vendor: VendorService) {}

  ngOnInit(): void {
    this.vendor.getPayments(this.auth.getVendorId()).subscribe({
      next: data => {
        this.records  = data;
        this.filtered = data;
        this.totalPaid = data.reduce((s, r) => s + (parseFloat(r.Wrbtr) || 0), 0);
        this.loading = false;
      },
      error: () => { this.error = 'Failed to load payment data.'; this.loading = false; }
    });
  }

  onSearch(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.records.filter(r => r.Belnr?.toLowerCase().includes(q));
  }

  formatDate(sapDate: any): string {
  if (!sapDate) return '—';
  
  // If it's already a Date object (from our Service transformation)
  if (sapDate instanceof Date) {
    return sapDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  // Fallback: If it's still the SAP string /Date(ms)/
  const m = String(sapDate).match(/(\d+)/);
  if (m) return new Date(+m[1]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  
  return sapDate;
}

  ageBucket(sapDate: any): string {
  if (!sapDate) return 'unknown';
  
  let timestamp: number;
  if (sapDate instanceof Date) {
    timestamp = sapDate.getTime();
  } else {
    const m = String(sapDate).match(/(\d+)/);
    if (!m) return 'unknown';
    timestamp = +m[1];
  }

  const days = Math.floor((Date.now() - timestamp) / 86400000);
  if (days <= 30)  return '0-30';
  if (days <= 60)  return '31-60';
  if (days <= 90)  return '61-90';
  return '90+';
}

 bucketCount(key: string): number {
  return this.records.filter(r => this.ageBucket(r.Budat) === key).length;
}

  // Change sapDate type from string to any
bucketClass(sapDate: any): string {
  const b = this.ageBucket(sapDate);
  const classes: Record<string, string> = { 
    '0-30': 'kt-badge-success', 
    '31-60': 'kt-badge-info', 
    '61-90': 'kt-badge-warning', 
    '90+': 'kt-badge-danger' 
  };
  return classes[b] || 'kt-badge-gray';
}
}
