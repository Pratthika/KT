import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PayslipPdfResponse {
  pdf: string; // Base64-encoded PDF string
}

@Injectable({ providedIn: 'root' })
export class PayslippdfService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPayslipPdf(pernr: string): Observable<PayslipPdfResponse> {
  // Change .post to .get and move pernr into the URL string
    return this.http.get<PayslipPdfResponse>(`${this.baseUrl}/payslippdf/${pernr}`);
  }

  /** Convert base64 string to a Blob and trigger browser download */
  downloadPdf(base64: string, filename = 'payslip.pdf'): void {
    const byteChars = atob(base64);
    const byteNumbers = Array.from(byteChars, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  /** Convert base64 string to an object URL for inline viewing */
  getPdfObjectUrl(base64: string): string {
    const byteChars = atob(base64);
    const byteNumbers = Array.from(byteChars, (c) => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    return URL.createObjectURL(blob);
  }
}