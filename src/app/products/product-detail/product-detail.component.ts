import { Component, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { EMPTY, Observable, catchError, combineLatest, map, mergeMap, share, shareReplay, switchMap, tap } from 'rxjs';

import { ProductsService } from '../products.service';
import { LoggedInUser } from 'src/app/logged-in-user';
import { UsersService } from 'src/app/users.service';
import { User } from 'src/app/user';

@Component({
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  showCrossell = false;

  readonly id$ = this.activatedRoute.paramMap.pipe(
    map(paramMap => Number(paramMap.get('id')!))
  );

  private readonly product$ = this.id$.pipe(
    switchMap(id =>
      this.productsService.getProduct(id)
        .pipe(catchError(err => {
          if (err instanceof HttpErrorResponse) {
            console.error('Failed to get product');

            return EMPTY;
          }

          throw err;
        }))
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly productWithCategory$ = this.product$.pipe(
    switchMap(product =>
      this.productsService.getCategory(product.categoryId)
        .pipe(
          catchError(() => {
            console.error('Failed to get category');

            return EMPTY;
          }),
          map(category => ({ product, category }))
        )
    )
  );

  readonly someProductsFromSameCategory$ = this.product$.pipe(
    switchMap(product =>
      this.productsService.getAllProducts({ categoryId: product.categoryId, _limit: '3' })
        .pipe(
          catchError(() => {
            console.error('Failed to get categories');

            return EMPTY;
          }),
          map(res => res.body!)
        )
    )
  );

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private readonly productsService: ProductsService,
    usersService: UsersService,
    @Inject(LoggedInUser) loggedInUser$: Observable<User | null>) {
      combineLatest([this.product$, loggedInUser$]).pipe(
        tap({
          subscribe: () => { console.log('combineLatest subscribed'); },
          unsubscribe: () => { console.log('combineLatest unsubscribed'); }
        }),
        takeUntilDestroyed(),
        mergeMap(([product, user]) =>
          user ? usersService.update(user.id, { lastViewedProductId: product.id })
            .pipe(
              catchError(() => {
                console.error('Failed to update user');

                return EMPTY;
              })
            ): EMPTY
        )
      ).subscribe();
  }
}
