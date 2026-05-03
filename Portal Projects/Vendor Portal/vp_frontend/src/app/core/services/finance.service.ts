import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface FinanceRecord {
  Belnr: string;
  Budat: string;
  Wrbtr: string;
  Waers: string;
  Blart: string;
  Name1: string;
  Lifnr: string;
  [key: string]: any;
}

export interface ODataResponse<T> {
  d: { results: T[] };
}

@Injectable({ providedIn: 'root' })
export class FinanceService {
  constructor(private http: HttpClient) {}

  getFinance(vendorId: string): Observable<FinanceRecord[]> {
    return this.http
      .get<ODataResponse<FinanceRecord>>(`${environment.apiUrl}/finance`, {
        params: { vendorId }
      })
      .pipe(map(res => res.d?.results || []));
  }
}