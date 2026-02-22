import { Routes } from '@angular/router';
import { WorkListComponent } from './pages/work-list/work-list.component';
import { WorkDetailComponent } from './pages/work-detail/work-detail.component';

export const WORK_ROUTES: Routes = [
  {
    path: '',
    component: WorkListComponent
  },
  {
    path: ':id',
    component: WorkDetailComponent
  }
];
