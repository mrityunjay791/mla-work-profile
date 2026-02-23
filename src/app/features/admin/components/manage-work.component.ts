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
import { takeUntil, switchMap } from 'rxjs/operators';
import { AdminWorkService } from '../../../services/admin-work.service';
import { WorkPageService } from '../../../services/work-page.service';
import { WorkItem } from '../../../models/work-item.interface';
import { Vidhansabha } from '../../../models/vidhansabha.interface';
import { Panchayat } from '../../../models/panchayat.interface';
import { Ward } from '../../../models/ward.interface';

@Component({
  selector: 'app-manage-work',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './manage-work.component.html',
  styleUrl: './manage-work.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManageWorkComponent implements OnInit, OnDestroy {
  private readonly adminWorkService = inject(AdminWorkService);
  private readonly workPageService = inject(WorkPageService);
  private readonly fb = inject(FormBuilder);
  private readonly destroy$ = new Subject<void>();

  // Signals
  vidhansabhas = signal<Vidhansabha[]>([]);
  panchayats = signal<Panchayat[]>([]);
  wards = signal<Ward[]>([]);
  workItems = signal<WorkItem[]>([]);

  isLoadingVidhansabhas = signal(false);
  isLoadingPanchayats = signal(false);
  isLoadingWards = signal(false);
  isLoadingWorkItems = signal(false);
  isSubmitting = signal(false);

  editingId = signal<number | null>(null);
  showForm = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  deleteConfirmId = signal<number | null>(null);

  // Pagination
  currentPage = signal(1);
  itemsPerPage = signal(5);
  displayedWorkItems = computed(() => {
    const items = this.workItems();
    const page = this.currentPage();
    const perPage = this.itemsPerPage();
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  });

  totalPages = computed(() => {
    return Math.ceil(this.workItems().length / this.itemsPerPage());
  });

  workForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadVidhansabhas();
    this.loadWorkItems();
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.workForm = this.fb.group({
      vidhansabha: ['', Validators.required],
      panchayat: [{ value: '', disabled: true }, Validators.required],
      ward: [{ value: '', disabled: true }, Validators.required],
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  private setupFormListeners(): void {
    this.workForm.get('vidhansabha')?.valueChanges
      .pipe(
        switchMap((vidhansabhaId) => {
          if (!vidhansabhaId) {
            this.panchayats.set([]);
            this.wards.set([]);
            this.workForm.get('panchayat')?.reset({ value: '', disabled: true });
            this.workForm.get('ward')?.reset({ value: '', disabled: true });
            return [];
          }
          this.isLoadingPanchayats.set(true);
          this.workForm.get('panchayat')?.enable();
          return this.workPageService.getPanchayats(vidhansabhaId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.panchayats.set(data || []);
          this.isLoadingPanchayats.set(false);
        },
        error: () => this.isLoadingPanchayats.set(false)
      });

    this.workForm.get('panchayat')?.valueChanges
      .pipe(
        switchMap((panchayatId) => {
          if (!panchayatId) {
            this.wards.set([]);
            this.workForm.get('ward')?.reset({ value: '', disabled: true });
            return [];
          }
          this.isLoadingWards.set(true);
          this.workForm.get('ward')?.enable();
          return this.workPageService.getWards(panchayatId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (data) => {
          this.wards.set(data || []);
          this.isLoadingWards.set(false);
        },
        error: () => this.isLoadingWards.set(false)
      });
  }

  private loadVidhansabhas(): void {
    this.isLoadingVidhansabhas.set(true);
    this.workPageService.getVidhansabhas()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.vidhansabhas.set(data);
          this.isLoadingVidhansabhas.set(false);
        },
        error: () => this.isLoadingVidhansabhas.set(false)
      });
  }

  private loadWorkItems(): void {
    this.isLoadingWorkItems.set(true);
    // Note: In a real app, you'd fetch all work items from an admin endpoint
    this.isLoadingWorkItems.set(false);
  }

  onSubmit(): void {
    if (this.workForm.invalid) {
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const formValue = this.workForm.getRawValue();
    const payload = {
      vidhansabhaId: formValue.vidhansabha,
      panchayatId: formValue.panchayat,
      wardId: formValue.ward,
      title: formValue.title,
      description: formValue.description,
      imageUrl: formValue.imageUrl,
      date: formValue.date,
      location: formValue.location
    };

    const request = this.editingId()
      ? this.adminWorkService.updateWork(this.editingId()!, payload)
      : this.adminWorkService.createWork(payload);

    request.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        const action = this.editingId() ? 'updated' : 'created';
        this.successMessage.set(`Work item ${action} successfully!`);
        this.resetForm();
        this.loadWorkItems();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(error.error?.message || 'Failed to save work item');
      }
    });
  }

  editWork(item: WorkItem): void {
    this.editingId.set(item.id);
    this.showForm.set(true);
    // Populate form with work data
    this.workForm.patchValue({
      vidhansabha: item.vidhansabhaId,
      panchayat: item.panchayatId,
      ward: item.wardId,
      title: item.title,
      description: item.description,
      imageUrl: item.imageUrl,
      date: item.date,
      location: item.location
    });
  }

  deleteWork(id: number): void {
    if (confirm('Are you sure you want to delete this work item?')) {
      this.adminWorkService.deleteWork(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.successMessage.set('Work item deleted successfully!');
            this.loadWorkItems();
            setTimeout(() => this.successMessage.set(''), 3000);
          },
          error: (error) => {
            this.errorMessage.set(error.error?.message || 'Failed to delete work item');
          }
        });
    }
  }

  resetForm(): void {
    this.workForm.reset();
    this.editingId.set(null);
    this.showForm.set(false);
    this.panchayats.set([]);
    this.wards.set([]);
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
