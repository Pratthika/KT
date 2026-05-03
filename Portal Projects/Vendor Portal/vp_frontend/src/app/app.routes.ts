import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: 'goods',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/goods/goods.component').then(m => m.GoodsComponent)
  },
  {
    path: 'invoices',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/invoices/invoices.component').then(m => m.InvoicesComponent)
  },
  {
    path: 'finance',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/finance/finance.component').then(m => m.FinanceComponent)
  },
  {
    path: 'payments',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/payments/payments.component').then(m => m.PaymentsComponent)
  },
  {
    path: 'memos',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/memos/memos.component').then(m => m.MemosComponent)
  },
  {
    path: 'rfq',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/rfq/rfq.component').then(m => m.RfqComponent)
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];