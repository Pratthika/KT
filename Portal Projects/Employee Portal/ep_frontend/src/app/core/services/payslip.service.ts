import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PayslipRecord {
  ENDDA: string;   // Validity End Date
  BEGDA: string;   // Validity Begin Date
  PLANS: string;   // Position ID
  BET01: number;   // Basic Pay Amount
  LGA01: string;   // Wage Type
  LGTXT: string;   // Wage Type Text
  ARBST: number;   // Daily Working Hours
  WKWDY: number;   // Work Week Days
  BANKL: string;   // Bank Key
  BANKN: string;   // Bank Account Number
  BANKS: string;   // Bank Country Key
}

export interface PayslipResponse {
  payslip: PayslipRecord[];
}

@Injectable({ providedIn: 'root' })
export class PayslipService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPayslip(pernr: string) {
    return this.http.get(`${this.baseUrl}/payslip/${pernr}`);
  }
}