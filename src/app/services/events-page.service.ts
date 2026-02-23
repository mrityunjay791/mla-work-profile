import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockApiService } from '../core/api/mock-api.service';
import { EventItem } from '../models/event-item.interface';

@Injectable({
  providedIn: 'root'
})
export class EventsPageService {
  private readonly http = inject(HttpClient);
  private readonly mockApi = inject(MockApiService);
  private readonly apiBaseUrl = '/api';
  private readonly useMock = environment.useMockApi;

  getEvents(): Observable<EventItem[]> {
    if (this.useMock) {
      return this.mockApi.getAllEvents();
    }
    return this.http.get<EventItem[]>(`${this.apiBaseUrl}/events`);
  }

  getEventById(id: number): Observable<EventItem> {
    if (this.useMock) {
      return this.mockApi.getEventById(id) as Observable<EventItem>;
    }
    return this.http.get<EventItem>(`${this.apiBaseUrl}/events/${id}`);
  }
}
