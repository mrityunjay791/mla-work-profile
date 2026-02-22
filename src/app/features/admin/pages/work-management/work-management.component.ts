import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkService } from '../../../../services/work.service';
import { WorkFormComponent } from '../../components/work-form/work-form.component';
import { Work } from '../../../../models/work.interface';

@Component({
  selector: 'app-work-management',
  standalone: true,
  imports: [CommonModule, WorkFormComponent],
  templateUrl: './work-management.component.html',
  styleUrl: './work-management.component.scss'
})
export class WorkManagementComponent implements OnInit {
  works: Work[] = [];
  showForm = false;
  editingWork: Work | null = null;

  constructor(private workService: WorkService) {}

  ngOnInit(): void {
    this.loadWorks();
  }

  loadWorks(): void {
    this.workService.getWorks().subscribe((works: Work[]) => {
      this.works = works;
    });
  }

  onAddClick(): void {
    this.editingWork = null;
    this.showForm = true;
  }

  onEditClick(work: Work): void {
    this.editingWork = work;
    this.showForm = true;
  }

  onFormSubmit(work: Work): void {
    if (this.editingWork) {
      this.workService.updateWork(this.editingWork.id, work).subscribe(() => {
        this.showForm = false;
        this.loadWorks();
      });
    } else {
      this.workService.addWork(work).subscribe(() => {
        this.showForm = false;
        this.loadWorks();
      });
    }
  }

  onFormCancel(): void {
    this.showForm = false;
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this work?')) {
      this.workService.deleteWork(id).subscribe(() => {
        this.loadWorks();
      });
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
