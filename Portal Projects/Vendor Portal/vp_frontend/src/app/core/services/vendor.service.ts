import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { tap } from 'rxjs';

export interface ODataResponse<T> {
  d: { results: T[] };
}

export interface GoodsRecord {
  Mblnr: string;
  Budat: string | Date;
  Menge: string;
  Meins: string;
  Matnr: string;
  Maktx: string;
  Lifnr: string;
  [key: string]: any;
}

export interface PoRecord {
  Ebeln: string;
  Bedat: string | Date;
  Lifnr: string;
  Netpr: string;
  Waers: string;
  Txz01: string;
  Ktmng: string;
  Meins: string;
  [key: string]: any;
}

export interface RfqRecord {
  Ebeln: string;
  Bedat: string;
  Lifnr: string;
  Matnr: string;
  Txz01: string;
  Ktmng: string;
  Meins: string;
  [key: string]: any;
}

export interface PayageRecord {
  Budat: string | Date;
  Wrbtr: string;
  Waers: string;
  Belnr: string;
  Lifnr: string;
  [key: string]: any;
}

export interface MemoRecord {
  Belnr: string;
  HBudat: string;
  Dmbtr: string;
  HWaers: string;
  Sgtxt: string;
  Lifnr: string;
  [key: string]: any;
}

export interface ProfileRecord {
  WfLifnr: string;
  WfName1: string;
  WfStras: string;
  WfOrt01: string;
  WfLand1: string;
  WfTelf1: string;
  WfSmtpAddr: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class VendorService {
  constructor(private http: HttpClient) {}

  getGoods(vendorId: string): Observable<GoodsRecord[]> {
    return this.http
      .get<ODataResponse<GoodsRecord>>(`${environment.apiUrl}/goods`, {
        params: { vendorId }
      })
      .pipe(map(res => res.d?.results || []));
  }

  getPurchaseOrders(vendorId: string): Observable<PoRecord[]> {
    return this.http
      .get<ODataResponse<PoRecord>>(`${environment.apiUrl}/po`, {
        params: { vendorId }
      })
      .pipe(map(res => res.d?.results || []));
  }

  getRfq(vendorId: string): Observable<RfqRecord[]> {
    return this.http
      .get<ODataResponse<RfqRecord>>(`${environment.apiUrl}/rfq`, {
        params: { vendorId }
      })
      .pipe(
        tap(res => console.log('RFQ Data:', res.d?.results[0])),
        map(res => res.d?.results || []));
  }

  getPayments(vendorId: string): Observable<PayageRecord[]> {
  return this.http
    .get<ODataResponse<PayageRecord>>(`${environment.apiUrl}/payage`, {
      params: { vendorId }
    })
    .pipe(
      map(res => (res.d?.results || []).map(item => {
        let finalDate = item.Budat;

        // Check if it's a string BEFORE using .includes or .match
        if (typeof finalDate === 'string' && finalDate.includes('Date')) {
          const ms = finalDate.match(/\d+/);
          finalDate = ms ? new Date(parseInt(ms[0])) : finalDate;
        }

        return {
          ...item,
          Augdt: finalDate
        };
      }))
    );
}

  getMemos(vendorId: string): Observable<MemoRecord[]> {
    return this.http
      .get<ODataResponse<MemoRecord>>(`${environment.apiUrl}/memo`, {
        params: { vendorId }
      })
      .pipe(
        tap(res => console.log('Memo Data from SAP:', res.d?.results[0])),
        map(res => res.d?.results || []));
  }

  getProfile(vendorId: string): Observable<ProfileRecord> {
    return this.http
      .get<{ d: ProfileRecord }>(`${environment.apiUrl}/profile`, {
        params: { vendorId }
      })
      .pipe(
        tap(res => console.log('Actual Profile Data from OData:', res.d)),
        map(res => res.d));
  }
}