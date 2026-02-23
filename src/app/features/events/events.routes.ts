import { Routes } from '@angular/router';
import { EventsPageComponent } from './events-page.component';
import { EventsComponent } from './events.component';

export const EVENTS_ROUTES: Routes = [
  {
    path: '',
    component: EventsPageComponent
  },
  {
    path: 'legacy',
    component: EventsComponent
  }
];
