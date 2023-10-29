import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { User } from './user';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly http = inject(HttpClient);

  getAll() {
    return this.http.get<User[]>('/api/users');
  }

  update(id: number, patch: { name?: string; lastViewedProductId?: number; }) {
    return this.http.patch<User>('/api/users/' + id, patch);
  }
}
