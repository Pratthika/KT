import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class SapAuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only add headers for backend API calls
    if (req.url.startsWith(environment.apiUrl)) {
      const cloned = req.clone({
        setHeaders: { 'Content-Type': 'application/json' }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}