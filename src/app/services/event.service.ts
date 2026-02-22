import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Event } from '../models/event.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private localStorage: LocalStorageService) {}

  getEvents(): Observable<Event[]> {
    const events = this.localStorage.getEvents();
    return of(events);
  }

  getEventById(id: string): Observable<Event | undefined> {
    const events = this.localStorage.getEvents();
    return of(events.find(e => e.id === id));
  }

  getUpcomingEvents(): Observable<Event[]> {
    const now = new Date();
    const events = this.localStorage.getEvents()
      .filter(e => new Date(e.date) >= now && e.type === 'upcoming')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return of(events);
  }

  getPastEvents(): Observable<Event[]> {
    const now = new Date();
    const events = this.localStorage.getEvents()
      .filter(e => new Date(e.date) < now && e.type === 'past')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return of(events);
  }

  addEvent(event: Event): Observable<Event> {
    event.id = Date.now().toString();
    this.localStorage.addEvent(event);
    return of(event);
  }

  updateEvent(id: string, event: Event): Observable<Event> {
    this.localStorage.updateEvent(id, event);
    return of(event);
  }

  deleteEvent(id: string): Observable<boolean> {
    this.localStorage.deleteEvent(id);
    return of(true);
  }
}
