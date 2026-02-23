import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  signal,
  computed,
  inject
} from '@angular/core';
import {
  CommonModule,
  NgOptimizedImage
} from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventsPageService } from '../../services/events-page.service';
import { EventItem } from '../../models/event-item.interface';

type FilterType = 'upcoming' | 'past' | 'all';

interface FilteredEvents {
  upcoming: EventItem[];
  past: EventItem[];
  all: EventItem[];
}

@Component({
  selector: 'app-events-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './events-page.component.html',
  styleUrl: './events-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventsPageComponent implements OnInit, OnDestroy {
  private readonly eventsPageService = inject(EventsPageService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Signals for reactive state
  allEvents = signal<EventItem[]>([]);
  filteredEvents = signal<FilteredEvents>({
    upcoming: [],
    past: [],
    all: []
  });

  filterType = signal<FilterType>('upcoming');
  selectedMonth = signal<string | null>(null);
  isLoading = signal(false);
  selectedEvent = signal<EventItem | null>(null);
  showModal = signal(false);

  filterForm!: FormGroup;

  // Month options for dropdown
  months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' }
  ];

  // Computed signals
  displayedEvents = computed(() => {
    const events = this.filteredEvents();
    const filterType = this.filterType();
    const month = this.selectedMonth();

    let eventList: EventItem[] = [];

    if (filterType === 'upcoming') {
      eventList = events.upcoming;
    } else if (filterType === 'past') {
      eventList = events.past;
    } else {
      eventList = events.all;
    }

    if (month) {
      const selectedMonthNum = parseInt(month, 10);
      eventList = eventList.filter((event) => {
        const eventDate = new Date(event.eventDate);
        return eventDate.getMonth() + 1 === selectedMonthNum;
      });
    }

    return eventList;
  });

  upcomingCount = computed(() => this.filteredEvents().upcoming.length);
  pastCount = computed(() => this.filteredEvents().past.length);

  constructor() {
    this.filterForm = this.fb.group({
      filterType: ['upcoming', Validators.required],
      month: ['', []]
    });
  }

  ngOnInit(): void {
    this.loadEvents();
    this.setupFilterListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadEvents(): void {
    this.isLoading.set(true);
    this.eventsPageService
      .getEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.allEvents.set(data);
          this.segregateEvents(data);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading Events:', error);
          this.isLoading.set(false);
        }
      });
  }

  private segregateEvents(events: EventItem[]): void {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = events
      .filter((event) => new Date(event.eventDate) >= now)
      .sort(
        (a, b) =>
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      );

    const past = events
      .filter((event) => new Date(event.eventDate) < now)
      .sort(
        (a, b) =>
          new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime()
      );

    this.filteredEvents.set({
      upcoming,
      past,
      all: [...upcoming, ...past]
    });
  }

  private setupFilterListeners(): void {
    this.filterForm
      .get('filterType')
      ?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.filterType.set(value as FilterType);
      });

    this.filterForm
      .get('month')
      ?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.selectedMonth.set(value || null);
      });
  }

  setFilterType(type: FilterType): void {
    this.filterType.set(type);
    this.filterForm.get('filterType')?.setValue(type, { emitEvent: false });
  }

  resetFilters(): void {
    this.filterForm.reset({
      filterType: 'upcoming',
      month: ''
    });
    this.filterType.set('upcoming');
    this.selectedMonth.set(null);
  }

  openEventModal(event: EventItem): void {
    this.selectedEvent.set(event);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedEvent.set(null);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  isFutureEvent(dateString: string): boolean {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return new Date(dateString) >= now;
  }

  getDayOfMonth(dateString: string): number {
    return new Date(dateString).getDate();
  }

  getMonthAbbrv(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short' });
  }

  getYear(dateString: string): number {
    return new Date(dateString).getFullYear();
  }
}
