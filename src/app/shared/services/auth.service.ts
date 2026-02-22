import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() { }

  isAuthorized(): boolean {
    // Add your authorization logic here
    return true;
  }

  isAdmin(): boolean {
    // Add admin check logic here
    return false;
  }
}
