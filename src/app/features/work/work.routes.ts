import { Routes } from '@angular/router';
import { WorkPageComponent } from './work-page.component';
import { WorkListComponent } from './pages/work-list/work-list.component';
import { WorkDetailComponent } from './pages/work-detail/work-detail.component';

export const WORK_ROUTES: Routes = [
  {
    path: '',
    component: WorkPageComponent
  },
  {
    path: 'list',
    component: WorkListComponent
  },
  {
    path: ':id',
    component: WorkDetailComponent
  }
];
