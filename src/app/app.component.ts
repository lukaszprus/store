import { Component, inject } from '@angular/core';

import { User } from './user';
import { LoggedInUser } from './logged-in-user';
import { UsersService } from './users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  readonly loggedInUser$ = inject(LoggedInUser);
  private readonly usersService = inject(UsersService);

  readonly users$ = this.usersService.getAll();

  login(user: User) {
    this.loggedInUser$.next(user);
  }

  logout() {
    this.loggedInUser$.next(null);
  }
}
