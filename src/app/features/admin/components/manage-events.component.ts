import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AdminEventsService } from '../../../services/admin-events.service';
import { EventItem } from '../../../models/event-item.interface';

@Component({
  selector: 'app-manage-events',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-events.component.html',
  styleUrl: './manage-events.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageEventsComponent implements OnInit, OnDestroy {
  private readonly adminEventsService = inject(AdminEventsService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Signals
  events = signal<EventItem[]>([]);
  isLoadingEvents = signal(false);
  isSubmitting = signal(false);

  editingId = signal<number | null>(null);
  showForm = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(5);
  displayedEvents = computed(() => {
    const items = this.events();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  });

  totalPages = computed(() => {
    return Math.ceil(this.events().length / this.itemsPerPage());
  });

  eventForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      bannerUrl: ['', Validators.required],
      eventDate: ['', Validators.required],
      venue: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private loadEvents(): void {
    this.isLoadingEvents.set(true);
    // Note: In a real app, you'd fetch all events from an admin endpoint
    this.isLoadingEvents.set(false);
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const payload = {
      title: this.eventForm.get('title')?.value,
      description: this.eventForm.get('description')?.value,
      bannerUrl: this.eventForm.get('bannerUrl')?.value,
      eventDate: this.eventForm.get('eventDate')?.value,
      venue: this.eventForm.get('venue')?.value
    };

    const request = this.editingId()
      ? this.adminEventsService.updateEvent(this.editingId()!, payload)
      : this.adminEventsService.createEvent(payload);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        const action = this.editingId() ? 'updated' : 'created';
        this.successMessage.set(`Event ${action} successfully!`);
        this.resetForm();
        this.loadEvents();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to save event');
      }
    });
  }

  editEvent(event: EventItem): void {
    this.editingId.set(event.id);
    this.showForm.set(true);
    this.eventForm.patchValue({
      title: event.title,
      description: event.description,
      bannerUrl: event.bannerUrl,
      eventDate: event.eventDate.split('T')[0],
      venue: event.venue
    });
  }

  deleteEvent(id: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.adminEventsService.deleteEvent(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage.set('Event deleted successfully!');
            this.loadEvents();
            setTimeout(() => this.successMessage.set(''), 3000);
          },
          error: (error) => {
            this.errorMessage.set(error.error?.message || 'Failed to delete event');
          }
        });
    }
  }

  resetForm(): void {
    this.eventForm.reset();
    this.editingId.set(null);
    this.showForm.set(false);
  }

  toggleForm(): void {
    this.showForm.update((val) => !val);
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }
}
