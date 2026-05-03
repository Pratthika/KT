import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { VendorService, RfqRecord } from '../../core/services/vendor.service';

@Component({
  selector: 'app-rfq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rfq.component.html',
  styleUrls: ['./rfq.component.css']
})
export class RfqComponent implements OnInit {
  loading = true;
  error = '';
  records: RfqRecord[] = [];
  filtered: RfqRecord[] = [];
  search = '';

  constructor(private auth: AuthService, private vendor: VendorService) {}

  ngOnInit(): void {
    this.vendor.getRfq(this.auth.getVendorId()).subscribe({
      next: data => { this.records = data; this.filtered = data; this.loading = false; },
      error: () => { this.error = 'Failed to load RFQ data.'; this.loading = false; }
    });
  }

  onSearch(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.records.filter(r =>
      r.Ebeln?.toLowerCase().includes(q) ||
      r.Matnr?.toLowerCase().includes(q) ||
      r.Txz01?.toLowerCase().includes(q)
    );
  }

  formatDate(sapDate: string): string {
    if (!sapDate) return '—';
    const m = sapDate.match(/(\d+)/);
    if (m) return new Date(+m[1]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return sapDate;
  }
}