import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { WorkManagementComponent } from './pages/work-management/work-management.component';
import { EventManagementComponent } from './pages/event-management/event-management.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'work',
    component: WorkManagementComponent
  },
  {
    path: 'events',
    component: EventManagementComponent
  }
];
