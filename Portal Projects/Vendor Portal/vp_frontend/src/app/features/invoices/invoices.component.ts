import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { InvoiceService, InvoiceRecord } from '../../core/services/invoice.service';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  loading = true;
  error = '';
  records: InvoiceRecord[] = [];
  filtered: InvoiceRecord[] = [];
  search = '';
  downloadingId = '';

  constructor(private auth: AuthService, private invoiceSvc: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceSvc.getInvoices(this.auth.getVendorId()).subscribe({
      next: data => { this.records = data; this.filtered = data; this.loading = false; },
      error: () => { this.error = 'Failed to load invoices.'; this.loading = false; }
    });
  }

  onSearch(): void {
    const q = this.search.toLowerCase();
    this.filtered = this.records.filter(r =>
      r.Belnr?.toLowerCase().includes(q) ||
      r.Blart?.toLowerCase().includes(q)
    );
  }

  downloadPdf(belnr: string): void {
    this.downloadingId = belnr;
    this.invoiceSvc.getInvoicePdf(belnr, this.auth.getVendorId()).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice_${belnr}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        this.downloadingId = '';
      },
      error: () => { this.downloadingId = ''; }
    });
  }

  formatDate(sapDate: string): string {
    if (!sapDate) return '—';
    const m = sapDate.match(/(\d+)/);
    if (m) return new Date(+m[1]).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
    return sapDate;
  }
}