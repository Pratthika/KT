import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const pernr = localStorage.getItem('pernr');
    if (pernr) {
      const cloned = req.clone({
        setHeaders: { 'x-pernr': pernr },
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}