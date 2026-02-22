import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MlaProfile } from '../models/mla.interface';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MlaService {
  constructor(private localStorage: LocalStorageService) {}

  getMlaProfile(): Observable<MlaProfile> {
    const profile = this.localStorage.getMlaProfile();
    return of(profile!);
  }

  updateMlaProfile(profile: MlaProfile): Observable<MlaProfile> {
    this.localStorage.setMlaProfile(profile);
    return of(profile);
  }
}
