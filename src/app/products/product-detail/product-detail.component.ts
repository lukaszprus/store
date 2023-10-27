import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NEVER, catchError, map, share, shareReplay, switchMap } from 'rxjs';

import { ProductsService } from '../products.service';

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
        .pipe(catchError(() => {
          console.error('Failed to get product');

          return NEVER;
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

            return NEVER;
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

            return NEVER;
          }),
          map(res => res.body!)
        )
    )
  );

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly productsService: ProductsService) {}
}
