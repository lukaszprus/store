import { InjectionToken } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { User } from './user';

export const LoggedInUser = new InjectionToken<BehaviorSubject<User | null>>('Logged in user', {
  factory: () => new BehaviorSubject<User | null>(null)
});
