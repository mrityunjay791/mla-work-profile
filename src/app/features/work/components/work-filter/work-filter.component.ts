import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkFilter } from '../../../../models/filter.interface';
import { WorkService } from '../../../../services/work.service';

@Component({
  selector: 'app-work-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './work-filter.component.html',
  styleUrl: './work-filter.component.scss'
})
export class WorkFilterComponent implements OnInit {
  @Output() filterChange = new EventEmitter<WorkFilter>();

  categories: string[] = [];
  selectedCategory = '';
  searchText = '';
  startDate = '';
  endDate = '';

  constructor(private workService: WorkService) {}

  ngOnInit(): void {
    this.workService.getCategories().subscribe((cats: string[]) => {
      this.categories = cats;
    });
  }

  applyFilter(): void {
    const filter: WorkFilter = {
      category: this.selectedCategory || undefined,
      searchText: this.searchText || undefined,
      startDate: this.startDate ? new Date(this.startDate) : undefined,
      endDate: this.endDate ? new Date(this.endDate) : undefined
    };
    this.filterChange.emit(filter);
  }

  resetFilter(): void {
    this.selectedCategory = '';
    this.searchText = '';
    this.startDate = '';
    this.endDate = '';
    this.applyFilter();
  }
}
