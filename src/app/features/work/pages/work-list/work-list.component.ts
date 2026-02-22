import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkFilterComponent } from '../../components/work-filter/work-filter.component';
import { WorkService } from '../../../../services/work.service';
import { Work } from '../../../../models/work.interface';
import { WorkFilter } from '../../../../models/filter.interface';

@Component({
  selector: 'app-work-list',
  standalone: true,
  imports: [CommonModule, RouterLink, WorkFilterComponent],
  templateUrl: './work-list.component.html',
  styleUrl: './work-list.component.scss'
})
export class WorkListComponent implements OnInit {
  works: Work[] = [];
  filteredWorks: Work[] = [];

  constructor(private workService: WorkService) {}

  ngOnInit(): void {
    this.loadWorks();
  }

  loadWorks(): void {
    this.workService.getWorks().subscribe((works: Work[]) => {
      this.works = works;
      this.filteredWorks = works;
    });
  }

  onFilterChange(filter: WorkFilter): void {
    this.workService.filterWorks(filter).subscribe((works: Work[]) => {
      this.filteredWorks = works;
    });
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}
