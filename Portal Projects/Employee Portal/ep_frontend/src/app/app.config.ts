import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

// Import your routes and interceptor
import { routes } from './app.routes';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // 1. Set up Routing
    provideRouter(routes),

    // 2. Set up HTTP Client with Interceptor support
    provideHttpClient(
      withInterceptorsFromDi()
    ),

    // 3. Register your Auth Interceptor
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },

    // 4. Import Modules that don't have "provide" functions yet
    importProvidersFrom(
      BrowserModule,
      FormsModule
    )
  ]
};