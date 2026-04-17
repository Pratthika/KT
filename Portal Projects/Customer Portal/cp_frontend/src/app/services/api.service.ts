import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface LoginResponse {
  success: boolean;
  token: string;
  customerId: string;
  message?: string;
}
export interface CustomerProfile {
  customerId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  credit_limit: number;
  currency: string;
}
export interface Inquiry {
  inquiryId: string;
  date: string;
  material: string;
  quantity: number;
  status: string;
}
export interface SaleOrder {
  orderId: string;
  date: string;
  material: string;
  quantity: number;
  value: number;
  currency: string;
  status: string;
}
export interface Delivery {
  deliveryId: string;
  orderId: string;
  date: string;
  material: string;
  quantity: number;
  status: string;
}
export interface Invoice {
  invoiceId: string;
  date: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: string;
}
export interface Payment {
  paymentId: string;
  invoiceId: string;
  billingDate: string;
  dueDate: string;
  amount: number;
  aging: number;
  currency: string;
}
export interface Memo {
  memoId: string;
  type: 'CREDIT' | 'DEBIT';
  date: string;
  amount: number;
  currency: string;
  reason: string;
}
export interface OverallSales {
  totalOrders: number;
  totalValue: number;
  currency: string;
}
// ── Chart-ready aggregated types (computed from existing data) ────────────────

export interface SalesTrend {
  date: string;       // order date
  value: number;      // sales value
}

export interface MaterialSales {
  material: string;
  totalQty: number;
  totalValue: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface DeliveryTrend {
  date: string;
  count: number;
}

export interface ConversionData {
  month: string;
  inquiries: number;
  orders: number;
}

export interface InvoiceTrend {
  date: string;
  amount: number;
}

export interface AgingBucket {
  label: string;   // '0-30', '30-60', '60+'
  count: number;
}

export interface MemoComparison {
  month: string;
  creditAmount: number;
  debitAmount: number;
}
// ── Service ───────────────────────────────────────────────────────────────────
@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth
  login(customerId: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.base}/login`, { customerId, password })
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('customerId');
  }

  // Profile
  getProfile(custId?: string): Observable<CustomerProfile> {
    // If no ID is passed, we check localStorage or just hit the base profile route
    const id = custId || localStorage.getItem('customerId');
    const url = id ? `${this.base}/profile/${id}` : `${this.base}/profile`;
    return this.http.get<CustomerProfile>(url).pipe(catchError(this.handleError));
  }

  // Dashboard
  getDashboardData(custId: string): Observable<any> {
  return this.http
    .get<any>(`${this.base}/dashboard/${custId}`)
    .pipe(catchError(this.handleError));
}

  // Finance
  getFinanceData(custId: string): Observable<any> {
  return this.http
    .get<any>(`${this.base}/finance/${custId}`)
    .pipe(catchError(this.handleError));
}

// Inside api.service.ts -> class ApiService
getInvoicePdf(vbeln: string): Observable<Blob> {
  const custId = localStorage.getItem('customerId');
  return this.http.get(`${this.base}/invoice/${custId}/${vbeln}`, {
    responseType: 'blob' 
  });
}

  private handleError(error: any) {
    const msg = error?.error?.message || error?.message || 'Something went wrong.';
    return throwError(() => new Error(msg));
  }
}