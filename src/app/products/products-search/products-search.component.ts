import { Component, inject } from '@angular/core';
import { EMPTY, Observable, Subject, catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { ProductsService } from '../products.service';

@Component({
  templateUrl: './products-search.component.html'
})
export class ProductsSearchComponent {
  productsService = inject(ProductsService);

  readonly searchTerms$ = new Subject<string>();

  readonly products$ = this.searchTerms$
    .pipe(
      switchMap(searchTerm => this.productsService.getAllProducts({ q: searchTerm })
        .pipe(
          catchError(() => EMPTY)
        )),
      switchMap(res => {
        const products = res.body!;

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
      })
    );
}
