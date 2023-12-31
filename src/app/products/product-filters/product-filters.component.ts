import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs';

import { ProductsService } from '../products.service';

export interface Filters {
  categoryId: number | null;
  brand: string;
}

@Component({
  selector: 'app-product-filters',
  templateUrl: './product-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductFiltersComponent implements OnInit, OnDestroy, OnChanges {
  @Input() filters: Filters | null | undefined;
  @Output() filtersChange = new EventEmitter<Filters>();

  filtersForm = new FormGroup({
    categoryId: new FormControl<number | null>(null),
    brand: new FormControl('', { nonNullable: true })
  });

  private subs: Subscription | undefined;
  categories$ = this.productsService.getAllCategories();
  brands$ = this.productsService.getAllBrands();

  constructor(private readonly productsService: ProductsService) {}

  ngOnChanges() {
    if (this.filters) {
      this.filtersForm.setValue(this.filters, { emitEvent: false });
    } else {
      this.filtersForm.reset(undefined, { emitEvent: false });
    }
  }

  ngOnInit() {
    this.subs = this.filtersForm.valueChanges
      .subscribe(value => {
        this.filtersChange.emit(value as Required<typeof value>);
      })
  }

  ngOnDestroy() {
    this.subs && this.subs.unsubscribe();
  }
}
