import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart, ChartConfiguration, ChartData,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { ApiService, Invoice, Payment, Memo, OverallSales } from '../../services/api.service';

Chart.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

type Tab = 'charts' | 'invoices' | 'payments' | 'memos' | 'sales';

@Component({
  selector: 'app-finance',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './finance.component.html',
  styleUrls: ['./finance.component.css']
})
export class FinanceComponent implements OnInit {
  activeTab: Tab = 'charts';

  invoices:     Invoice[]           = [];
  payments:     Payment[]           = [];
  memos:        Memo[]              = [];
  overallSales: OverallSales | null = null;
  currency:     string              = '';

  filteredInvoices: Invoice[] = [];
  filteredPayments: Payment[] = [];
  filteredMemos:    Memo[]    = [];

  searchTerm = ''; statusFilter = ''; memoTypeFilter = '';
  dateFrom = ''; dateTo = '';
  availableStatuses: string[] = [];
  filteredCount = 0;

  loading = false;
  error   = '';

  private RED    = '#9d0102';
  private ORANGE = '#ff3f00';
  private LIGHT  = '#c0c0c0';

  // --- CHART DATA & OPTIONS ---
  invoiceTrendData: ChartData<'line'> = { labels: [], datasets: [] };
  invoiceTrendOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  agingPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  // ADD THIS:
  agingPieOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  paymentDoughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  // ADD THIS:
  // Change the type from ChartConfiguration['options'] to 'ChartOptions<"doughnut">'
  paymentDoughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // Now TypeScript knows this is allowed!
    plugins: {
      legend: { position: 'right' }
    }
  };

  memoBarData: ChartData<'bar'> = { labels: [], datasets: [] };
  // ADD THIS:
  memoBarOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } }
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadSapFinanceData();
  }

  loadSapFinanceData() {
    const id = localStorage.getItem('customerId');
    if (!id) {
      this.error = 'Login required';
      return;
    }

    this.loading = true;
    this.api.getFinanceData(id).subscribe({
      next: (data) => {
        this.invoices = data.invoices || [];
        this.payments = data.payments || [];
        this.memos = data.memos || [];
        this.currency = data.currency || 'EUR';
        
        this.overallSales = {
          totalOrders: data.invoices ? data.invoices.length : 0,
          totalValue: data.overallSales || 0,
          currency: this.currency
          // yearlyBreakdown removed
        };

        this.buildAllCharts();
        this.buildStatusOptions();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  buildAllCharts() {
    this.buildInvoiceTrend();
    this.buildAgingPie();
    this.buildPaymentDoughnut();
    this.buildMemoBar();
  }

  buildInvoiceTrend() {
    const monthly: Record<string, number> = {};
    this.invoices.forEach(inv => {
      const month = inv.date?.substring(0, 7);
      if (month) monthly[month] = (monthly[month] || 0) + (inv.amount || 0);
    });
    const labels = Object.keys(monthly).sort();
    this.invoiceTrendData = {
      labels,
      datasets: [{
        data: labels.map(l => monthly[l]),
        label: `Revenue (${this.currency})`,
        borderColor: this.RED,
        backgroundColor: 'rgba(157,1,2,0.08)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  buildAgingPie() {
    let b0_30 = 0, b30_60 = 0, b60plus = 0;
    this.payments.forEach(p => {
      const d = p.aging || 0;
      if (d <= 30) b0_30++;
      else if (d <= 60) b30_60++;
      else b60plus++;
    });
    this.agingPieData = {
      labels: ['0-30 Days', '30-60 Days', '60+ Days'],
      datasets: [{
        data: [b0_30, b30_60, b60plus],
        backgroundColor: ['#0f7a40', '#b35c00', this.RED]
      }]
    };
  }

  buildPaymentDoughnut() {
    const statusMap: Record<string, number> = {};
    this.invoices.forEach(inv => {
      const s = inv.status || 'Pending';
      statusMap[s] = (statusMap[s] || 0) + 1;
    });
    const labels = Object.keys(statusMap);
    const colors: Record<string, string> = {
      'paid': '#0f7a40', 'Paid': '#0f7a40',
      'overdue': this.RED, 'Overdue': this.RED,
      'pending': this.ORANGE, 'Pending': this.ORANGE
    };
    this.paymentDoughnutData = {
      labels,
      datasets: [{
        data: Object.values(statusMap),
        backgroundColor: labels.map(l => colors[l] || this.LIGHT)
      }]
    };
  }

  buildMemoBar() {
    const creditMap: Record<string, number> = {};
    const debitMap:  Record<string, number> = {};
    this.memos.forEach(m => {
      const month = m.date?.substring(0, 7);
      if (!month) return;
      if (m.type?.toUpperCase() === 'CREDIT') creditMap[month] = (creditMap[month] || 0) + (m.amount || 0);
      else debitMap[month] = (debitMap[month] || 0) + (m.amount || 0);
    });
    const labels = [...new Set([...Object.keys(creditMap), ...Object.keys(debitMap)])].sort();
    this.memoBarData = {
      labels,
      datasets: [
        { data: labels.map(l => creditMap[l] || 0), label: 'Credit', backgroundColor: '#0f7a40' },
        { data: labels.map(l => debitMap[l] || 0), label: 'Debit', backgroundColor: this.RED }
      ]
    };
  }

  // Inside finance.component.ts
downloadInvoice(invoiceId: string) {
  // Use a loading flag if you have one to show a spinner
  this.loading = true; 

  this.api.getInvoicePdf(invoiceId).subscribe({
    next: (blob: Blob) => {
      // Create a temporary URL for the PDF data
      const url = window.URL.createObjectURL(blob);
      
      // Create a hidden 'a' tag to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${invoiceId}.pdf`;
      
      // Trigger the download and clean up
      link.click();
      window.URL.revokeObjectURL(url);
      
      this.loading = false;
    },
    error: (err) => {
      console.error('Download error:', err);
      alert('Failed to download PDF. Please check if the invoice exists in SAP.');
      this.loading = false;
    }
  });
}

  // --- FILTER & UI LOGIC ---
  switchTab(tab: Tab) {
    this.activeTab = tab;
    this.clearFilters();
    this.buildStatusOptions();
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase();
    
    if (this.activeTab === 'invoices') {
      this.filteredInvoices = this.invoices.filter(r => 
        (!term || r.invoiceId?.toLowerCase().includes(term)) &&
        (!this.statusFilter || r.status === this.statusFilter) &&
        this.matchDate(r.date)
      );
      this.filteredCount = this.filteredInvoices.length;
    } else if (this.activeTab === 'payments') {
      this.filteredPayments = this.payments.filter(r => 
        (!term || r.paymentId?.toLowerCase().includes(term) || r.invoiceId?.toLowerCase().includes(term)) &&
        this.matchDate(r.billingDate)
      );
      this.filteredCount = this.filteredPayments.length;
    } else if (this.activeTab === 'memos') {
      this.filteredMemos = this.memos.filter(r => 
        (!term || r.memoId?.toLowerCase().includes(term)) &&
        (!this.memoTypeFilter || r.type?.toUpperCase() === this.memoTypeFilter) &&
        this.matchDate(r.date)
      );
      this.filteredCount = this.filteredMemos.length;
    }
  }

  private matchDate(dateStr: string): boolean {
    if (!dateStr || (!this.dateFrom && !this.dateTo)) return true;
    const d = new Date(dateStr).getTime();
    const from = this.dateFrom ? new Date(this.dateFrom).getTime() : -Infinity;
    const to   = this.dateTo   ? new Date(this.dateTo).getTime()   : Infinity;
    return d >= from && d <= to;
  }

  buildStatusOptions() {
    if (this.activeTab === 'invoices') {
      this.availableStatuses = [...new Set(this.invoices.map(i => i.status).filter(Boolean))];
    }
  }

  clearFilters() {
    this.searchTerm = ''; this.statusFilter = ''; this.memoTypeFilter = '';
    this.dateFrom = ''; this.dateTo = '';
    this.applyFilters();
  }

  // STYLE HELPERS
  agingClass = (days: number) => days <= 0 ? 'status-green' : days <= 30 ? 'status-yellow' : 'status-red';
  
  invoiceStatusClass(s: string): string {
    const val = s?.toLowerCase();
    return val === 'paid' ? 'status-green' : val === 'overdue' ? 'status-red' : 'status-yellow';
  }
}