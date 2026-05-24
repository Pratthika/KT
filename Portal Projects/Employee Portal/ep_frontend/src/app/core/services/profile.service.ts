import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ProfileData {
  PERNR: string;
  VORNA: string;   // First Name
  NACHN: string;   // Last Name
  GESCH: string;   // Gender
  NATIO: string;   // Nationality
  SPRSL: string;   // Language Key
  GBTAG: string;   // Date of Birth
  BEGDA: string;   // Valid From
  ENDDA: string;   // Valid To
  ORT01: string;   // City
  PSTLZ: string;   // Postal Code
  LAND1: string;   // Country
  LOCAT: string;   // Location
}

export interface ProfileResponse {
  profile: ProfileData[];
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Inside ProfileService
  getProfile(pernr: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${pernr}`); // Use backticks and /${pernr}
  }
}