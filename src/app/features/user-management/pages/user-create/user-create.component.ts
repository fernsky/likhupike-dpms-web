import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserActions } from '../../store/user.actions';
import { CreateUserRequest } from '../../models/user.interface';
import * as UserSelectors from '../../store/user.selectors';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss'],
})
export class UserCreateComponent implements OnDestroy {
  loading$ = this.store.select(UserSelectors.selectUserCreating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private router: Router
  ) {
    // Clear any existing errors when component initializes
    this.store.dispatch(UserActions.clearUserErrors());
  }

  onSubmit(request: CreateUserRequest): void {
    this.store.dispatch(UserActions.createUser({ request }));

    // Navigate back to list on successful creation
    this.store
      .select(UserSelectors.selectUserCreating)
      .pipe(takeUntil(this.destroy$))
      .subscribe((creating) => {
        if (!creating) {
          this.navigateBack();
        }
      });
  }

  onCancel(): void {
    this.navigateBack();
  }

  private navigateBack(): void {
    this.router.navigate(['/dashboard/users/list']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
