import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockApiService } from '../core/api/mock-api.service';
import { WorkItem } from '../models/work-item.interface';

export interface CreateWorkRequest {
  vidhansabhaId: number;
  panchayatId: number;
  wardId: number;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminWorkService {
  private readonly http = inject(HttpClient);
  private readonly mockApi = inject(MockApiService);
  private readonly apiBaseUrl = '/api';
  private readonly useMock = environment.useMockApi;

  createWork(data: CreateWorkRequest): Observable<WorkItem> {
    if (this.useMock) {
      return this.mockApi.createWorkItem(data);
    }
    return this.http.post<WorkItem>(`${this.apiBaseUrl}/work`, data);
  }

  updateWork(id: number, data: CreateWorkRequest): Observable<WorkItem> {
    if (this.useMock) {
      return this.mockApi.updateWorkItem(id, data);
    }
    return this.http.put<WorkItem>(`${this.apiBaseUrl}/work/${id}`, data);
  }

  deleteWork(id: number): Observable<void> {
    if (this.useMock) {
      return this.mockApi.deleteWorkItem(id);
    }
    return this.http.delete<void>(`${this.apiBaseUrl}/work/${id}`);
  }

  getWorkById(id: number): Observable<WorkItem> {
    if (this.useMock) {
      return this.mockApi.getWorkItemById(id) as Observable<WorkItem>;
    }
    return this.http.get<WorkItem>(`${this.apiBaseUrl}/work/${id}`);
  }
}
