import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LoginResponse {
  status: string;   // 'S' = success, 'E' = error
  message: string;
  pernr?: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(pernr: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.baseUrl}/login`, { pernr, password })
      .pipe(
        tap((res) => {
          if (res.status === 'S') {
            localStorage.setItem('pernr', pernr);
            localStorage.setItem('isLoggedIn', 'true');
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('pernr');
    localStorage.removeItem('isLoggedIn');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getPernr(): string {
    return localStorage.getItem('pernr') || '';
  }
}