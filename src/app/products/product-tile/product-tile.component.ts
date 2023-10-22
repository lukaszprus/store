import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from '../product';
import { TOGGLE_BACKGROUND_DEFAULT_COLOR } from 'src/app/toggle-background.directive';

@Component({
  selector: 'app-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: TOGGLE_BACKGROUND_DEFAULT_COLOR, useValue: '#d3d3d3' }],
})
export class ProductTileComponent {
  @Input() product!: Product;
}
