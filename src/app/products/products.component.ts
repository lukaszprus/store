import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { NEVER, Observable, catchError, combineLatest, distinctUntilChanged, map, shareReplay, switchMap } from 'rxjs';

import { isEqual, isUndefined, pick } from 'lodash';

import { ProductsService } from './products.service';
import { Sorting } from '../sorter/sorter.component';
import { Filters } from './product-filters/product-filters.component';

interface ParamsOfInterest {
  page: string;
  sortBy?: string;
  sortType?: string;
  category?: string;
  brand?: string;
}

@Component({
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  private readonly paramsOfInterest$: Observable<ParamsOfInterest> = this.route.queryParams
    .pipe(
      map(params => {
        const newParams = pick(params, ['page', 'sortBy', 'sortType', 'category', 'brand']);

        isUndefined(newParams.page) && (newParams.page = '1');

        return newParams;
      }),
      distinctUntilChanged(isEqual)
    );

  private readonly page$ = this.paramsOfInterest$
    .pipe(
      map(params => Number(params.page))
    );

  readonly filters$ = this.paramsOfInterest$
    .pipe(
      map(({ category, brand }) => ({ category: category || '', brand: brand || '' }))
    );

  readonly sorting$ = this.paramsOfInterest$
    .pipe(
      map(({ sortBy, sortType }) => ({ by: sortBy || '', type: (sortType && ['asc', 'desc'].includes(sortType) ? sortType : '') as 'asc' | 'desc' | '' }))
    );

  private readonly productsAndCollectionSize$ = this.paramsOfInterest$
    .pipe(
      switchMap(({ page, sortBy, sortType, category, brand }) => {
        const params: { [param: string]: string; } = { _page: page, _limit: '10' };

        isUndefined(category) || (params['category'] = category);
        isUndefined(brand) || (params['brand'] = brand);
        isUndefined(sortBy) || (params['_sort'] = sortBy);
        isUndefined(sortType) || (params['_order'] = sortType);

        return this.productsService.getAll(params)
          .pipe(
            catchError(() => NEVER), // TODO: Handle errors globally through an interceptor
            map(res => ({
              products: res.body!,
              collectionSize: Number(res.headers.get('X-Total-Count')!)
            }))
          );
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );

  readonly products$ = this.productsAndCollectionSize$
    .pipe(
      map(({ products }) => products)
    );

  readonly pageAndCollectionSize$ = combineLatest([this.page$, this.productsAndCollectionSize$])
    .pipe(
      map(([page, productsAndCollectionSize]) => ({ page, collectionSize: productsAndCollectionSize.collectionSize }))
    );

  readonly sorterByOptions = [
    { value: 'price', label: 'Price' },
    { value: 'rating', label: 'Rating' },
    { value: 'stock', label: 'Stock' }
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productsService: ProductsService) {}

  navigate(queryParams: Params) {
    this.router.navigate([], { queryParams,  queryParamsHandling: 'merge' });
  }

  onSortingChange(sorting: Sorting) {
    const queryParams = { page: 1, sortBy: sorting.by || undefined , sortType: sorting.type || undefined };

    this.navigate(queryParams);
  }

  onFiltersChange(filters: Filters) {
    const queryParams = { page: 1, brand: filters.brand || undefined , category: filters.category || undefined };

    this.navigate(queryParams);
  }
}
