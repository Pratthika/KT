import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

import { LoginComponent }      from './pages/login/login.component';
import { DashboardComponent }  from './pages/dashboard/dashboard.component';
import { ProfileComponent }    from './pages/profile/profile.component';
import { LeaveComponent }      from './pages/leave/leave.component';
import { PayslipComponent }    from './pages/payslip/payslip.component';
import { PayslippdfComponent } from './pages/payslippdf/payslippdf.component';

export const routes: Routes = [
  { path: '',           redirectTo: 'login', pathMatch: 'full' },
  { path: 'login',      component: LoginComponent },
  { path: 'dashboard',  component: DashboardComponent,  canActivate: [AuthGuard] },
  { path: 'profile',    component: ProfileComponent,    canActivate: [AuthGuard] },
  { path: 'leave',      component: LeaveComponent,      canActivate: [AuthGuard] },
  { path: 'payslip',    component: PayslipComponent,    canActivate: [AuthGuard] },
  { path: 'payslippdf', component: PayslippdfComponent, canActivate: [AuthGuard] },
  { path: '**',         redirectTo: 'login' },
];