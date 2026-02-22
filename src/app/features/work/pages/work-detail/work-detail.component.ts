import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WorkService } from '../../../../services/work.service';
import { Work } from '../../../../models/work.interface';

@Component({
  selector: 'app-work-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './work-detail.component.html',
  styleUrl: './work-detail.component.scss'
})
export class WorkDetailComponent implements OnInit {
  work: Work | null = null;
  notFound = false;

  constructor(
    private route: ActivatedRoute,
    private workService: WorkService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      const id = params['id'];
      this.workService.getWorkById(id).subscribe((work: Work | undefined) => {
        if (work) {
          this.work = work;
        } else {
          this.notFound = true;
        }
      });
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
