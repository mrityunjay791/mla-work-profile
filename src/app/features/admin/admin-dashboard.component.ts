import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';
import { ManageWorkComponent } from './components/manage-work.component';
import { ManageEventsComponent } from './components/manage-events.component';

type AdminTab = 'work' | 'events';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ManageWorkComponent, ManageEventsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  activeTab = signal<AdminTab>('work');
  username = this.authService.username;

  setActiveTab(tab: AdminTab): void {
    this.activeTab.set(tab);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
