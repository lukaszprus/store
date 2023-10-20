import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from '../product';

@Component({
  selector: 'app-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTileComponent {
  @Input() product!: Product;
}
