import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { VendorService, MemoRecord } from '../../core/services/vendor.service';

@Component({
  selector: 'app-memos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './memos.component.html',
  styleUrls: ['./memos.component.css']
})
export class MemosComponent implements OnInit {
  loading = true;
  error = '';
  records: MemoRecord[] = [];
  filtered: MemoRecord[] = [];
  search = '';

  constructor(private auth: AuthService, private vendor: VendorService) {}

  ngOnInit(): void {
    this.vendor.getMemos(this.auth.getVendorId()).subscribe({
      next: data => { this.records = data; this.filtered = data; this.loading = false; },
      error: () => { this.error = 'Failed to load memo data.'; this.loading = false; }
    });
  }

  onSearch(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.records.filter(r =>
      r.Belnr?.toLowerCase().includes(q) ||
      r.Sgtxt?.toLowerCase().includes(q)
    );
  }

  formatDate(sapDate: string): string {
    if (!sapDate) return '—';
    const m = sapDate.match(/(\d+)/);
    if (m) return new Date(+m[1]).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    return sapDate;
  }
}