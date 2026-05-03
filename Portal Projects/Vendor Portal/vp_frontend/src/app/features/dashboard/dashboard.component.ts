import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { VendorService } from '../../core/services/vendor.service';
import { InvoiceService } from '../../core/services/invoice.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  vendorId = '';
  vendorName = '';

  stats = {
    openPOs: 0,
    pendingInvoices: 0,
    goodsReceipts: 0,
    openRfqs: 0
  };

  recentInvoices: any[] = [];
  recentPOs: any[] = [];

  constructor(
    private auth: AuthService,
    private vendor: VendorService,
    private invoiceSvc: InvoiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const session = this.auth.getSession();
    this.vendorId   = session?.vendorId || '';
    this.vendorName = session?.name     || 'Vendor';

    forkJoin({
      pos:      this.vendor.getPurchaseOrders(this.vendorId).pipe(catchError(() => of([]))),
      invoices: this.invoiceSvc.getInvoices(this.vendorId).pipe(catchError(() => of([]))),
      goods:    this.vendor.getGoods(this.vendorId).pipe(catchError(() => of([]))),
      rfq:      this.vendor.getRfq(this.vendorId).pipe(catchError(() => of([])))
    }).subscribe(({ pos, invoices, goods, rfq }) => {
      this.stats.openPOs          = pos.length;
      this.stats.pendingInvoices  = invoices.length;
      this.stats.goodsReceipts    = goods.length;
      this.stats.openRfqs         = rfq.length;
      this.recentInvoices         = invoices.slice(0, 5);
      this.recentPOs              = pos.slice(0, 5);
      this.loading = false;
    });
  }

  navigate(route: string): void { this.router.navigate([route]); }

  formatAmount(val: string, currency = 'INR'): string {
    const n = parseFloat(val);
    if (isNaN(n)) return val || '—';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  }

  formatDate(sapDate: string): string {
    if (!sapDate) return '—';
    const match = sapDate.match(/(\d+)/);
    if (match) {
      const d = new Date(parseInt(match[1]));
      return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return sapDate;
  }
}