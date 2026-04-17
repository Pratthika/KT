import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// 1. IMPORT CHART DEPS FROM CLAUDE
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart, ChartConfiguration, ChartData, ChartType,
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { ApiService, Inquiry, SaleOrder, Delivery } from '../../services/api.service';

// 2. REGISTER CHART COMPONENTS
Chart.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

// Added 'charts' to your Tab type
type Tab = 'charts' | 'inquiries' | 'orders' | 'deliveries';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective], // Added BaseChartDirective
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  activeTab: Tab = 'charts'; // Default to charts as per Claude's UI

  // YOUR DATA STORAGE
  inquiries:   Inquiry[]   = [];
  saleOrders: SaleOrder[] = [];
  deliveries: Delivery[]  = [];

  // FILTERED RESULTS
  filteredInquiries:   Inquiry[]   = [];
  filteredOrders:      SaleOrder[] = [];
  filteredDeliveries: Delivery[]  = [];

  // FILTER STATE
  searchTerm = '';
  statusFilter = '';
  dateFrom = '';
  dateTo = '';
  availableStatuses: string[] = [];
  filteredCount = 0;

  loading = false;
  error = '';
  chartsLoading = true;

  // CLAUDE'S CHART COLOR PALETTE
  private RED    = '#9d0102';
  private ORANGE = '#ff3f00';
  private GREY   = '#606062';
  private LIGHT  = '#c0c0c0';

  // CHART DATA DEFINITIONS (Direct Copy from Claude)
  salesTrendData: ChartData<'line'> = { labels: [], datasets: [] };
  salesTrendOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  materialBarData: ChartData<'bar'> = { labels: [], datasets: [] };
  materialBarOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  statusPieData: ChartData<'pie'> = { labels: [], datasets: [] };
  statusPieOptions: ChartConfiguration['options'] = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  deliveryTrendData: ChartData<'line'> = { labels: [], datasets: [] };
  conversionBarData: ChartData<'bar'> = { labels: [], datasets: [] };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    const id = localStorage.getItem('customerId');
    if (!id) {
      this.error = 'Login required';
      return;
    }

    this.loading = true;
    this.chartsLoading = true;

    // INTEGRATED FETCH: Keep your single call, then trigger Claude's charts
    this.api.getDashboardData(id).subscribe({
      next: (data) => {
        this.inquiries = data.inquiries || [];
        this.saleOrders = data.saleOrders || [];
        this.deliveries = data.deliveries || [];

        // PROCESS CHARTS NOW DATA IS HERE
        this.buildAllCharts();
        
        this.loading = false;
        this.chartsLoading = false;
        
        this.buildStatusOptions();
        this.applyFilters();
      },
      error: (err) => {
        this.error = "Failed to load SAP data.";
        this.loading = false;
        this.chartsLoading = false;
      }
    });
  }

  // --- CHART BUILDING LOGIC (Direct Copy from Claude) ---
  buildAllCharts() {
    this.buildSalesTrend();
    this.buildMaterialBar();
    this.buildStatusPie();
    this.buildDeliveryTrend();
    this.buildConversionBar();
  }

  buildSalesTrend() {
    const sorted = [...this.saleOrders].sort((a, b) => a.date.localeCompare(b.date));
    const monthly: Record<string, number> = {};
    sorted.forEach(o => {
      const month = o.date.substring(0, 7);
      monthly[month] = (monthly[month] || 0) + (Number(o.value) || 0); // Ensure numeric
    });
    this.salesTrendData = {
      labels: Object.keys(monthly),
      datasets: [{
        data: Object.values(monthly),
        label: 'Sales Value',
        borderColor: this.RED,
        backgroundColor: 'rgba(157,1,2,0.08)',
        fill: true,
        tension: 0.4
      }]
    };
  }

  buildMaterialBar() {
    const matMap: Record<string, number> = {};
    this.saleOrders.forEach(o => {
      if (o.material) matMap[o.material] = (matMap[o.material] || 0) + (Number(o.quantity) || 0);
    });
    const sorted = Object.entries(matMap).sort((a, b) => b[1] - a[1]).slice(0, 10);
    this.materialBarData = {
      labels: sorted.map(([k]) => k),
      datasets: [{
        data: sorted.map(([, v]) => v),
        label: 'Quantity',
        backgroundColor: this.RED
      }]
    };
  }

  buildStatusPie() {
    const statusMap: Record<string, number> = {};
    this.saleOrders.forEach(o => {
      if (o.status) statusMap[o.status] = (statusMap[o.status] || 0) + 1;
    });
    this.statusPieData = {
      labels: Object.keys(statusMap),
      datasets: [{ data: Object.values(statusMap), backgroundColor: [this.RED, this.ORANGE, this.GREY] }]
    };
  }

  buildDeliveryTrend() {
    const monthly: Record<string, number> = {};
    this.deliveries.forEach(d => {
      const month = d.date?.substring(0, 7);
      if (month) monthly[month] = (monthly[month] || 0) + 1;
    });
    const labels = Object.keys(monthly).sort();
    this.deliveryTrendData = {
      labels,
      datasets: [{ data: labels.map(l => monthly[l]), label: 'Deliveries', borderColor: this.ORANGE, fill: true }]
    };
  }

  buildConversionBar() {
    const inqMap: Record<string, number> = {};
    const ordMap: Record<string, number> = {};
    this.inquiries.forEach(i => { const m = i.date?.substring(0, 7); if (m) inqMap[m] = (inqMap[m] || 0) + 1; });
    this.saleOrders.forEach(o => { const m = o.date?.substring(0, 7); if (m) ordMap[m] = (ordMap[m] || 0) + 1; });
    const labels = [...new Set([...Object.keys(inqMap), ...Object.keys(ordMap)])].sort().slice(-8);
    this.conversionBarData = {
      labels,
      datasets: [
        { data: labels.map(l => inqMap[l] || 0), label: 'Inquiries', backgroundColor: this.LIGHT },
        { data: labels.map(l => ordMap[l] || 0), label: 'Orders', backgroundColor: this.RED }
      ]
    };
  }

  // --- YOUR ORIGINAL TABLE & FILTER LOGIC ---
  switchTab(tab: Tab) {
    this.activeTab = tab;
    this.buildStatusOptions();
    this.applyFilters();
  }

  applyFilters() {
    const term = this.searchTerm.toLowerCase();
    if (this.activeTab === 'inquiries') {
      this.filteredInquiries = this.inquiries.filter(r => this.matchSearch(term, r.inquiryId, r.material) && this.matchStatus(r.status) && this.matchDate(r.date));
      this.filteredCount = this.filteredInquiries.length;
    } else if (this.activeTab === 'orders') {
      this.filteredOrders = this.saleOrders.filter(r => this.matchSearch(term, r.orderId, r.material) && this.matchStatus(r.status) && this.matchDate(r.date));
      this.filteredCount = this.filteredOrders.length;
    } else if (this.activeTab === 'deliveries') {
      this.filteredDeliveries = this.deliveries.filter(r => this.matchSearch(term, r.deliveryId, r.material, r.orderId) && this.matchStatus(r.status) && this.matchDate(r.date));
      this.filteredCount = this.filteredDeliveries.length;
    }
  }

  private matchSearch(term: string, ...fields: string[]): boolean {
    if (!term) return true;
    return fields.some(f => f?.toLowerCase().includes(term));
  }

  private matchStatus(status: string): boolean {
    if (!this.statusFilter) return true;
    return status === this.statusFilter;
  }

  private matchDate(dateStr: string): boolean {
    if (!dateStr || (!this.dateFrom && !this.dateTo)) return true;
    const d = new Date(dateStr).getTime();
    const from = this.dateFrom ? new Date(this.dateFrom).getTime() : -Infinity;
    const to = this.dateTo ? new Date(this.dateTo).getTime() : Infinity;
    return d >= from && d <= to;
  }

  buildStatusOptions() {
    const rows = this.activeTab === 'inquiries' ? this.inquiries :
                 this.activeTab === 'orders' ? this.saleOrders : this.deliveries;
    if (Array.isArray(rows)) {
      this.availableStatuses = [...new Set(rows.map(r => r.status).filter(Boolean))];
    }
  }

  get searchPlaceholder(): string {
    if (this.activeTab === 'inquiries') return 'Search by Inquiry ID...';
    if (this.activeTab === 'orders') return 'Search by Order ID...';
    return 'Search by Delivery ID...';
  }

  clearFilters() {
    this.searchTerm = ''; this.statusFilter = ''; this.dateFrom = ''; this.dateTo = '';
    this.applyFilters();
  }

  statusClass(s: string): string {
    const v = s?.toLowerCase();
    if (['completed','delivered','closed','paid'].includes(v)) return 'status-green';
    if (['pending','open','in progress'].includes(v)) return 'status-yellow';
    if (['cancelled','rejected','overdue'].includes(v)) return 'status-red';
    return 'status-gray';
  }
}