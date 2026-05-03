import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface InvoiceRecord {
  Belnr: string;
  Budat: string;
  Wrbtr: string;
  Waers: string;
  Zfbdt: string;
  Lifnr: string;
  Blart: string;
  [key: string]: any;
}

export interface ODataResponse<T> {
  d: { results: T[] };
}

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  constructor(private http: HttpClient) {}

  getInvoices(vendorId: string): Observable<InvoiceRecord[]> {
    return this.http
      .get<ODataResponse<InvoiceRecord>>(`${environment.apiUrl}/finance`, {
        params: { vendorId }
      })
      .pipe(map(res => res.d?.results || []));
  }

  getInvoicePdf(belnr: string, vendorId: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/invoice`, {
      params: { belnr, vendorId },
      responseType: 'blob'
    });
  }
}