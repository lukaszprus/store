import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NEVER, catchError, map, share, switchMap } from 'rxjs';

import { ProductsService } from '../products.service';

@Component({
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  readonly id$ = this.activatedRoute.paramMap.pipe(
    map(paramMap => Number(paramMap.get('id')!))
  );

  readonly product$ = this.id$.pipe(
    switchMap(id =>
      this.productsService.get(id)
        .pipe(catchError(() => NEVER))
    ),
    share()
  );

  readonly someProductsFromSameCategory$ = this.product$.pipe(
    switchMap(product =>
      this.productsService.getAll({ categoryId: product.categoryId.toString(), _limit: '3' })
        .pipe(
          catchError(() => NEVER),
          map(res => res.body!)
        )
    )
  );

  constructor(private readonly activatedRoute: ActivatedRoute, private readonly productsService: ProductsService) {}
}
