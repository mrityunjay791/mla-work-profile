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
import {
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  switchMap
} from 'rxjs/operators';
import { WorkPageService } from '../../services/work-page.service';
import { Vidhansabha } from '../../models/vidhansabha.interface';
import { Panchayat } from '../../models/panchayat.interface';
import { Ward } from '../../models/ward.interface';
import { WorkItem } from '../../models/work-item.interface';

@Component({
  selector: 'app-work-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './work-page.component.html',
  styleUrl: './work-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkPageComponent implements OnInit, OnDestroy {
  private readonly workPageService = inject(WorkPageService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Signals for reactive state
  vidhansabhas = signal<Vidhansabha[]>([]);
  panchayats = signal<Panchayat[]>([]);
  wards = signal<Ward[]>([]);
  workItems = signal<WorkItem[]>([]);
  filteredWorkItems = signal<WorkItem[]>([]);

  isLoadingVidhansabha = signal(false);
  isLoadingPanchayat = signal(false);
  isLoadingWard = signal(false);
  isLoadingWorkItems = signal(false);

  searchText = signal('');
  selectedWorkItem = signal<WorkItem | null>(null);
  showModal = signal(false);

  // Computed signal for filtered work items
  displayedWorkItems = computed(() => {
    const items = this.filteredWorkItems();
    const search = this.searchText().toLowerCase();

    if (!search) {
      return items;
    }

    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.location.toLowerCase().includes(search)
    );
  });

  filterForm!: FormGroup;

  constructor() {
    this.filterForm = this.fb.group({
      vidhansabha: ['', Validators.required],
      panchayat: [{ value: '', disabled: true }, Validators.required],
      ward: [{ value: '', disabled: true }, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadVidhansabhas();
    this.setupFilterListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadVidhansabhas(): void {
    this.isLoadingVidhansabha.set(true);
    this.workPageService
      .getVidhansabhas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.vidhansabhas.set(data);
          this.isLoadingVidhansabha.set(false);
        },
        error: (error) => {
          console.error('Error loading Vidhansabhas:', error);
          this.isLoadingVidhansabha.set(false);
        }
      });
  }

  private setupFilterListeners(): void {
    // Listen to Vidhansabha changes
    this.filterForm
      .get('vidhansabha')
      ?.valueChanges
      .pipe(
        distinctUntilChanged(),
        switchMap((vidhansabhaId) => {
          if (!vidhansabhaId) {
            this.panchayats.set([]);
            this.wards.set([]);
            this.workItems.set([]);
            this.filteredWorkItems.set([]);
            this.filterForm.get('panchayat')?.reset({ value: '', disabled: true });
            this.filterForm.get('ward')?.reset({ value: '', disabled: true });
            return [];
          }

          this.isLoadingPanchayat.set(true);
          this.filterForm.get('panchayat')?.enable();
          return this.workPageService.getPanchayats(vidhansabhaId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.panchayats.set(data || []);
          this.isLoadingPanchayat.set(false);
        },
        error: (error) => {
          console.error('Error loading Panchayats:', error);
          this.isLoadingPanchayat.set(false);
        }
      });

    // Listen to Panchayat changes
    this.filterForm
      .get('panchayat')
      ?.valueChanges
      .pipe(
        distinctUntilChanged(),
        switchMap((panchayatId) => {
          if (!panchayatId) {
            this.wards.set([]);
            this.workItems.set([]);
            this.filteredWorkItems.set([]);
            this.filterForm.get('ward')?.reset({ value: '', disabled: true });
            return [];
          }

          this.isLoadingWard.set(true);
          this.filterForm.get('ward')?.enable();
          return this.workPageService.getWards(panchayatId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.wards.set(data || []);
          this.isLoadingWard.set(false);
        },
        error: (error) => {
          console.error('Error loading Wards:', error);
          this.isLoadingWard.set(false);
        }
      });

    // Listen to Ward changes
    this.filterForm
      .get('ward')
      ?.valueChanges
      .pipe(
        distinctUntilChanged(),
        switchMap((wardId) => {
          if (!wardId) {
            this.workItems.set([]);
            this.filteredWorkItems.set([]);
            return [];
          }

          this.isLoadingWorkItems.set(true);
          return this.workPageService.getWorkItems(wardId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.workItems.set(data || []);
          this.filteredWorkItems.set(data || []);
          this.isLoadingWorkItems.set(false);
        },
        error: (error) => {
          console.error('Error loading Work Items:', error);
          this.isLoadingWorkItems.set(false);
        }
      });
  }

  onSearchChange(text: string): void {
    this.searchText.set(text);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.panchayats.set([]);
    this.wards.set([]);
    this.workItems.set([]);
    this.filteredWorkItems.set([]);
    this.searchText.set('');
    this.filterForm.get('panchayat')?.disable();
    this.filterForm.get('ward')?.disable();
  }

  openWorkItemModal(item: WorkItem): void {
    this.selectedWorkItem.set(item);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.selectedWorkItem.set(null);
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
}
