import { Routes } from '@angular/router';
import { adminGuard } from '../../core/auth/auth.guard';
import { AdminDashboardComponent } from './admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [adminGuard]
  }
];
