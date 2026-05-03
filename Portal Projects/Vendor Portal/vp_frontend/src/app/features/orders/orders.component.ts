import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { VendorService, PoRecord } from '../../core/services/vendor.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  loading = true;
  error = '';
  records: PoRecord[] = [];
  filtered: PoRecord[] = [];
  search = '';

  constructor(private auth: AuthService, private vendor: VendorService) {}

  ngOnInit(): void {
    this.vendor.getPurchaseOrders(this.auth.getVendorId()).subscribe({
      next: data => { this.records = data; this.filtered = data; this.loading = false; },
      error: () => { this.error = 'Failed to load purchase orders.'; this.loading = false; }
    });
  }

  onSearch(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.records.filter(r =>
      // Use bracket notation ['PropertyName'] instead of dot notation .PropertyName
      (r['Ebeln']?.toLowerCase().includes(q)) ||
      (r['Txz01']?.toLowerCase().includes(q)) ||
      (r['Matnr']?.toLowerCase().includes(q))
    );
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
}