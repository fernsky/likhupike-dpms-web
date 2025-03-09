import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UserActions } from '../../store/user.actions';
import { CreateUserRequest } from '../../models/user.interface';
import * as UserSelectors from '../../store/user.selectors';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss'],
})
export class UserEditComponent implements OnInit, OnDestroy {
  loading$ = this.store.select(UserSelectors.selectUserUpdating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  user$ = this.store.select(UserSelectors.selectSelectedUser);
  private destroy$ = new Subject<void>();
  private userId: string = '';

  constructor(
    private store: Store,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Clear any existing errors
    this.store.dispatch(UserActions.clearUserErrors());

    // Get user ID from route param and load user
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.userId = params['id'];
      if (this.userId) {
        // Dispatch action to load user details
        this.store.dispatch(UserActions.loadUser({ id: this.userId }));
      } else {
        this.navigateBack();
      }
    });

    // Navigate back on successful update
    this.store
      .select(UserSelectors.selectUserUpdating)
      .pipe(
        takeUntil(this.destroy$),
        filter((updating) => !updating)
      )
      .subscribe(() => {
        if (!this.store.select(UserSelectors.selectUserErrors)) {
          this.navigateBack();
        }
      });
  }

  onSubmit(request: CreateUserRequest): void {
    this.store.dispatch(
      UserActions.updateUser({
        id: this.userId,
        request: {
          ...request,
          // Only include password if it was changed
          password: request.password || undefined,
        },
      })
    );
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
