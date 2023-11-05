import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { EMPTY, Observable, ReplaySubject, Subject, Subscription, catchError, filter, forkJoin, map, of, share, switchMap } from 'rxjs';

import { ProductsService } from '../products.service';

export interface ResultsStats {
  query: string;
  total: number;
  categoryIdOfFirstProduct: number | null;
}

@Component({
  templateUrl: './products-search.component.html'
})
export class ProductsSearchComponent implements OnInit, OnDestroy {
  private readonly productsService = inject(ProductsService);

  readonly queries$ = new Subject<string>();
  readonly resultsStats$ = new ReplaySubject<ResultsStats>();

  showSearchLog = false;

  private subs: Subscription | undefined;

  readonly queryAndProducts$ = this.queries$
    .pipe(
      switchMap(query => query ? this.productsService.getAllProducts({ q: query })
        .pipe(
          catchError(() => EMPTY),
          map(res => ({
            query,
            products: res.body!
          }))
        ) : of(null)),
      share()
    );

  readonly productsWithCategoryName$ = this.queryAndProducts$
    .pipe(
      switchMap(queryAndProduct => {
        if (!queryAndProduct) {
          return of(null);
        }

        const products = queryAndProduct.products;

        if (products.length) {
          const categories$ = products.reduce((acc, product) => {
            acc[product.categoryId] || (acc[product.categoryId] = this.productsService.getCategory(product.categoryId)
              .pipe(
                catchError(() => of(undefined)),
                map(category => category ? category.name : undefined)
              ));

            return acc;
          }, {} as { [key: number]: Observable<string | undefined>; });

          return forkJoin(categories$).pipe(
            map(categories => products.map(product => ({ ...product, categoryName: categories[product.categoryId] })))
          );
        }

        return of(products);
      })
    );

    ngOnInit() {
      this.subs = this.queryAndProducts$
        .pipe(filter(queryAndProduct => !!queryAndProduct))
        .subscribe(queryAndProduct => {
          this.resultsStats$.next({
            query: queryAndProduct!.query,
            total: queryAndProduct!.products.length,
            categoryIdOfFirstProduct: queryAndProduct!.products.length ? queryAndProduct!.products[0].categoryId : null
          });
        });
    }

    ngOnDestroy() {
      this.subs && this.subs.unsubscribe();
    }
}
