import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { Subscription, tap } from 'rxjs';

import { ProductsSearchComponent, ResultsStats } from '../products-search/products-search.component';

@Component({
  selector: 'app-search-log',
  templateUrl: './search-log.component.html'
})
export class SearchLogComponent implements OnInit, OnDestroy {
  private readonly resultsStats$ = inject(ProductsSearchComponent).resultsStats$;
  private subs: Subscription | undefined;

  resultsStatsLog: ResultsStats[] = [];

  ngOnInit() {
    this.subs = this.resultsStats$
      .pipe(tap({
        subscribe: () => { console.log('Subscribing to results stats'); },
        unsubscribe: () => { console.log('Unsubscribing from results stats'); }
      }))
      .subscribe(resultsStats => {
        // console.log('New results stats');

        this.resultsStatsLog.push(resultsStats);
      });
  }

  ngOnDestroy() {
    this.subs && this.subs.unsubscribe();
  }
}
