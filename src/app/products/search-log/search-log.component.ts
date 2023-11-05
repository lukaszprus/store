import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { Subscription, concatMap, map, of, tap } from 'rxjs';

import { ProductsSearchComponent, ResultsStats } from '../products-search/products-search.component';
import { ProductsService } from '../products.service';

type ResultsStatsWithCategoryName = Omit<ResultsStats, 'categoryIdOfFirstProduct'> & { categoryNameOfFirstProduct: string | null; };

@Component({
  selector: 'app-search-log',
  templateUrl: './search-log.component.html'
})
export class SearchLogComponent implements OnInit, OnDestroy {
  private readonly resultsStats$ = inject(ProductsSearchComponent).resultsStats$;
  private readonly productsService = inject(ProductsService);
  private subs: Subscription | undefined;

  resultsStatsLog: ResultsStatsWithCategoryName[] = [];

  ngOnInit() {
    this.subs = this.resultsStats$
      .pipe(
        tap({
          subscribe: () => { console.log('Subscribing to results stats'); },
          unsubscribe: () => { console.log('Unsubscribing from results stats'); }
        }),
        concatMap(
          ({ query, total, categoryIdOfFirstProduct }) => total ? this.productsService.getCategory(categoryIdOfFirstProduct!)
          .pipe(
            map(category => ({ query, total, categoryNameOfFirstProduct: category.name }))
          ) : of({ query, total, categoryNameOfFirstProduct: null })
        )
      )
      .subscribe(resultsStats => {
        // console.log('New results stats');

        this.resultsStatsLog.push(resultsStats);
      });
  }

  ngOnDestroy() {
    this.subs && this.subs.unsubscribe();
  }
}
