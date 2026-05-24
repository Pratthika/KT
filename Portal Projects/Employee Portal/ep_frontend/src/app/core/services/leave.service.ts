import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeaveRecord {
  AWART: string;   // Absence type
  SUBTY: string;   // Subtype
  BEGDA: string;   // Start date
  ENDDA: string;   // End date
  ABWTG: number;   // Calendar days
  STDAZ: number;   // Hours
  UNAME: string;   // Changed by
  AEDTM: string;   // Changed on
  ANZHL: number;   // Quota
  ATEXT: string;   // Absence type text
}

export interface LeaveResponse {
  leave: LeaveRecord[];
}

@Injectable({ providedIn: 'root' })
export class LeaveService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLeave(pernr: string) {
    return this.http.get(`${this.baseUrl}/leave/${pernr}`); // CORRECT
  }
}