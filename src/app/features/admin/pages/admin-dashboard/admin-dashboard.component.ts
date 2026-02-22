import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkService } from '../../../../services/work.service';
import { EventService } from '../../../../services/event.service';
import { Work } from '../../../../models/work.interface';
import { Event } from '../../../../models/event.interface';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  workCount = 0;
  eventCount = 0;
  upcomingEventCount = 0;

  constructor(
    private workService: WorkService,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.workService.getWorks().subscribe((works: Work[]) => {
      this.workCount = works.length;
    });

    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.eventCount = events.length;
    });

    this.eventService.getUpcomingEvents().subscribe((events: Event[]) => {
      this.upcomingEventCount = events.length;
    });
  }
}
