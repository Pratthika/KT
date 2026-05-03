import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  d: {
    Lifnr: string;
    Name1: string;
    Ort01: string;
    Land1: string;
    SessionId?: string;
    [key: string]: any;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly SESSION_KEY = 'vp_session';

  constructor(private http: HttpClient) {}

  login(vendorId: string, password: string): Observable<LoginResponse> {
    return this.http
      .get<LoginResponse>(`${environment.apiUrl}/login`, {
        params: { vendorId, password }
      })
      .pipe(
        tap(res => {
          const user = {
            vendorId: res.d.Lifnr?.replace(/^0+/, '') || vendorId,
            name: res.d.Name1 || 'Vendor',
            city: res.d.Ort01 || '',
            country: res.d.Land1 || ''
          };
          sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(user));
        })
      );
  }

  logout(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.SESSION_KEY);
  }

  getSession(): { vendorId: string; name: string; city: string; country: string } | null {
    const raw = sessionStorage.getItem(this.SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  getVendorId(): string {
    return this.getSession()?.vendorId || '';
  }
}