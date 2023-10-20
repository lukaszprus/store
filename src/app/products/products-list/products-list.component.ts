import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from '../product';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent {
  @Input() products: ReadonlyArray<Product> = [];

  productTrackBy(index: number, product: Product) {
    return product.id;
  }
}
