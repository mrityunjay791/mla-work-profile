import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Work } from '../models/work.interface';
import { WorkFilter } from '../models/filter.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class WorkService {
  constructor(private localStorage: LocalStorageService) {}

  getWorks(): Observable<Work[]> {
    const works = this.localStorage.getWorks();
    return of(works);
  }

  getWorkById(id: string): Observable<Work | undefined> {
    const works = this.localStorage.getWorks();
    const work = works.find(w => w.id === id);
    return of(work);
  }

  filterWorks(filter: WorkFilter): Observable<Work[]> {
    let works = this.localStorage.getWorks();

    if (filter.category) {
      works = works.filter(w => w.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter.startDate) {
      works = works.filter(w => new Date(w.date) >= filter.startDate!);
    }

    if (filter.endDate) {
      works = works.filter(w => new Date(w.date) <= filter.endDate!);
    }

    if (filter.searchText) {
      const search = filter.searchText.toLowerCase();
      works = works.filter(w =>
        w.title.toLowerCase().includes(search) ||
        w.description.toLowerCase().includes(search)
      );
    }

    return of(works);
  }

  addWork(work: Work): Observable<Work> {
    work.id = Date.now().toString();
    this.localStorage.addWork(work);
    return of(work);
  }

  updateWork(id: string, work: Work): Observable<Work> {
    this.localStorage.updateWork(id, work);
    return of(work);
  }

  deleteWork(id: string): Observable<boolean> {
    this.localStorage.deleteWork(id);
    return of(true);
  }

  getCategories(): Observable<string[]> {
    const works = this.localStorage.getWorks();
    const categories = [...new Set(works.map(w => w.category))];
    return of(categories);
  }
}
