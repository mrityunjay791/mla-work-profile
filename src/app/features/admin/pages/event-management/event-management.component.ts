import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../../services/event.service';
import { EventFormComponent } from '../../components/event-form/event-form.component';
import { Event } from '../../../../models/event.interface';

@Component({
  selector: 'app-event-management',
  standalone: true,
  imports: [CommonModule, EventFormComponent],
  templateUrl: './event-management.component.html',
  styleUrl: './event-management.component.scss'
})
export class EventManagementComponent implements OnInit {
  events: Event[] = [];
  showForm = false;
  editingEvent: Event | null = null;

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getEvents().subscribe((events: Event[]) => {
      this.events = events;
    });
  }

  onAddClick(): void {
    this.editingEvent = null;
    this.showForm = true;
  }

  onEditClick(event: Event): void {
    this.editingEvent = event;
    this.showForm = true;
  }

  onFormSubmit(event: Event): void {
    if (this.editingEvent) {
      this.eventService.updateEvent(this.editingEvent.id, event).subscribe(() => {
        this.showForm = false;
        this.loadEvents();
      });
    } else {
      this.eventService.addEvent(event).subscribe(() => {
        this.showForm = false;
        this.loadEvents();
      });
    }
  }

  onFormCancel(): void {
    this.showForm = false;
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
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
