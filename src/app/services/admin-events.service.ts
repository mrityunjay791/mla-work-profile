import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockApiService } from '../core/api/mock-api.service';
import { EventItem } from '../models/event-item.interface';

export interface CreateEventRequest {
  title: string;
  description: string;
  bannerUrl: string;
  eventDate: string;
  venue: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminEventsService {
  private readonly http = inject(HttpClient);
  private readonly mockApi = inject(MockApiService);
  private readonly apiBaseUrl = '/api';
  private readonly useMock = environment.useMockApi;

  createEvent(data: CreateEventRequest): Observable<EventItem> {
    if (this.useMock) {
      return this.mockApi.createEvent(data);
    }
    return this.http.post<EventItem>(`${this.apiBaseUrl}/events`, data);
  }

  updateEvent(id: number, data: CreateEventRequest): Observable<EventItem> {
    if (this.useMock) {
      return this.mockApi.updateEvent(id, data);
    }
    return this.http.put<EventItem>(`${this.apiBaseUrl}/events/${id}`, data);
  }

  deleteEvent(id: number): Observable<void> {
    if (this.useMock) {
      return this.mockApi.deleteEvent(id);
    }
    return this.http.delete<void>(`${this.apiBaseUrl}/events/${id}`);
  }

  getEventById(id: number): Observable<EventItem> {
    if (this.useMock) {
      return this.mockApi.getEventById(id) as Observable<EventItem>;
    }
    return this.http.get<EventItem>(`${this.apiBaseUrl}/events/${id}`);
  }
}
