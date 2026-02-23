import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MockApiService } from '../core/api/mock-api.service';
import { Vidhansabha } from '../models/vidhansabha.interface';
import { Panchayat } from '../models/panchayat.interface';
import { Ward } from '../models/ward.interface';
import { WorkItem } from '../models/work-item.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkPageService {
  private readonly http = inject(HttpClient);
  private readonly mockApi = inject(MockApiService);
  private readonly apiBaseUrl = '/api';
  private readonly useMock = environment.useMockApi;

  getVidhansabhas(): Observable<Vidhansabha[]> {
    if (this.useMock) {
      return this.mockApi.getVidhansabhas();
    }
    return this.http.get<Vidhansabha[]>(`${this.apiBaseUrl}/vidhansabha`);
  }

  getPanchayats(vidhansabhaId: number): Observable<Panchayat[]> {
    if (this.useMock) {
      return this.mockApi.getPanchayats(vidhansabhaId);
    }
    return this.http.get<Panchayat[]>(
      `${this.apiBaseUrl}/panchayat?vidhansabhaId=${vidhansabhaId}`
    );
  }

  getWards(panchayatId: number): Observable<Ward[]> {
    if (this.useMock) {
      return this.mockApi.getWards(panchayatId);
    }
    return this.http.get<Ward[]>(
      `${this.apiBaseUrl}/ward?panchayatId=${panchayatId}`
    );
  }

  getWorkItems(wardId: number): Observable<WorkItem[]> {
    if (this.useMock) {
      return this.mockApi.getWorkItemsByWard(wardId);
    }
    return this.http.get<WorkItem[]>(
      `${this.apiBaseUrl}/work?wardId=${wardId}`
    );
  }

  getWorkItemsByPanchayat(panchayatId: number): Observable<WorkItem[]> {
    if (this.useMock) {
      return this.mockApi.getWorkItemsByPanchayat(panchayatId);
    }
    return this.http.get<WorkItem[]>(
      `${this.apiBaseUrl}/work?panchayatId=${panchayatId}`
    );
  }

  getWorkItemsByVidhansabha(vidhansabhaId: number): Observable<WorkItem[]> {
    if (this.useMock) {
      return this.mockApi.getWorkItemsByVidhansabha(vidhansabhaId);
    }
    return this.http.get<WorkItem[]>(
      `${this.apiBaseUrl}/work?vidhansabhaId=${vidhansabhaId}`
    );
  }

  getWorkItemById(id: number): Observable<WorkItem> {
    if (this.useMock) {
      return this.mockApi.getWorkItemById(id) as Observable<WorkItem>;
    }
    return this.http.get<WorkItem>(`${this.apiBaseUrl}/work/${id}`);
  }
}
