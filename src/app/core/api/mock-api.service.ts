import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  mockVidhansabhas,
  mockPanchayats,
  mockWards,
  mockWorkItems,
  mockEvents
} from './mock-data';
import { Vidhansabha } from '../../models/vidhansabha.interface';
import { Panchayat } from '../../models/panchayat.interface';
import { Ward } from '../../models/ward.interface';
import { WorkItem } from '../../models/work-item.interface';
import { EventItem } from '../../models/event-item.interface';

/**
 * Mock API Service
 * Provides offline/development responses for API calls without a backend
 * All responses include a 500ms delay to simulate network latency
 */
@Injectable({
  providedIn: 'root'
})
export class MockApiService {
  private readonly DELAY_MS = 500; // Simulate network latency

  /**
   * Get all Vidhansabhas
   */
  getVidhansabhas(): Observable<Vidhansabha[]> {
    return of([...mockVidhansabhas]).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get Panchayats for a specific Vidhansabha
   */
  getPanchayats(vidhansabhaId: number): Observable<Panchayat[]> {
    const panchayats = mockPanchayats.filter(
      (p) => p.vidhansabhaId === vidhansabhaId
    );
    return of(panchayats).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get Wards for a specific Panchayat
   */
  getWards(panchayatId: number): Observable<Ward[]> {
    const wards = mockWards.filter((w) => w.panchayatId === panchayatId);
    return of(wards).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get Work Items for a specific Ward
   */
  getWorkItemsByWard(wardId: number): Observable<WorkItem[]> {
    const items = mockWorkItems.filter((w) => w.wardId === wardId);
    return of(items).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get Work Items for a specific Panchayat
   */
  getWorkItemsByPanchayat(panchayatId: number): Observable<WorkItem[]> {
    const items = mockWorkItems.filter((w) => w.panchayatId === panchayatId);
    return of(items).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get Work Items for a specific Vidhansabha
   */
  getWorkItemsByVidhansabha(vidhansabhaId: number): Observable<WorkItem[]> {
    const items = mockWorkItems.filter(
      (w) => w.vidhansabhaId === vidhansabhaId
    );
    return of(items).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get all Work Items
   */
  getAllWorkItems(): Observable<WorkItem[]> {
    return of([...mockWorkItems]).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get all Events
   */
  getAllEvents(): Observable<EventItem[]> {
    return of([...mockEvents]).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get a specific Work Item by ID
   */
  getWorkItemById(id: number): Observable<WorkItem | undefined> {
    const item = mockWorkItems.find((w) => w.id === id);
    return of(item).pipe(delay(this.DELAY_MS));
  }

  /**
   * Get a specific Event by ID
   */
  getEventById(id: number): Observable<EventItem | undefined> {
    const event = mockEvents.find((e) => e.id === id);
    return of(event).pipe(delay(this.DELAY_MS));
  }

  /**
   * Create a new Work Item (mock implementation)
   */
  createWorkItem(item: Omit<WorkItem, 'id'>): Observable<WorkItem> {
    const newItem: WorkItem = {
      ...item,
      id: Math.max(...mockWorkItems.map((w) => w.id), 0) + 1
    };
    mockWorkItems.push(newItem);
    return of(newItem).pipe(delay(this.DELAY_MS));
  }

  /**
   * Update a Work Item (mock implementation)
   */
  updateWorkItem(id: number, item: Omit<WorkItem, 'id'>): Observable<WorkItem> {
    const index = mockWorkItems.findIndex((w) => w.id === id);
    if (index !== -1) {
      mockWorkItems[index] = { ...item, id };
      return of(mockWorkItems[index]).pipe(delay(this.DELAY_MS));
    }
    return of().pipe(delay(this.DELAY_MS));
  }

  /**
   * Delete a Work Item (mock implementation)
   */
  deleteWorkItem(id: number): Observable<void> {
    const index = mockWorkItems.findIndex((w) => w.id === id);
    if (index !== -1) {
      mockWorkItems.splice(index, 1);
    }
    return of().pipe(delay(this.DELAY_MS));
  }

  /**
   * Create a new Event (mock implementation)
   */
  createEvent(event: Omit<EventItem, 'id' | 'createdBy'>): Observable<EventItem> {
    const newEvent: EventItem = {
      ...event,
      id: Math.max(...mockEvents.map((e) => e.id), 0) + 1,
      createdBy: 'Admin'
    };
    mockEvents.push(newEvent);
    return of(newEvent).pipe(delay(this.DELAY_MS));
  }

  /**
   * Update an Event (mock implementation)
   */
  updateEvent(id: number, event: Omit<EventItem, 'id' | 'createdBy'>): Observable<EventItem> {
    const index = mockEvents.findIndex((e) => e.id === id);
    if (index !== -1) {
      const oldCreatedBy = mockEvents[index].createdBy;
      mockEvents[index] = { ...event, id, createdBy: oldCreatedBy };
      return of(mockEvents[index]).pipe(delay(this.DELAY_MS));
    }
    return of().pipe(delay(this.DELAY_MS));
  }

  /**
   * Delete an Event (mock implementation)
   */
  deleteEvent(id: number): Observable<void> {
    const index = mockEvents.findIndex((e) => e.id === id);
    if (index !== -1) {
      mockEvents.splice(index, 1);
    }
    return of().pipe(delay(this.DELAY_MS));
  }

  /**
   * Mock login endpoint
   */
  login(username: string, password: string): Observable<{ token: string }> {
    // Accept any non-empty username and password for demo
    if (username && password) {
      return of({
        token: `mock_token_${username}_${Date.now()}`
      }).pipe(delay(this.DELAY_MS));
    }
    throw new Error('Invalid credentials');
  }
}
