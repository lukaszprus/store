import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductFiltersComponent } from './product-filters/product-filters.component';
import { ProductTileComponent } from './product-tile/product-tile.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { SorterComponent } from '../sorter/sorter.component';
import { ProductsService } from './products.service';
import { TOGGLE_BACKGROUND_DEFAULT_COLOR, ToggleBackgroundDirective } from '../toggle-background.directive';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailComponent,
    ProductFiltersComponent,
    ProductTileComponent,
    ProductsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbPaginationModule,
    SorterComponent,
    ProductsRoutingModule,
    ToggleBackgroundDirective
  ],
  providers: [ProductsService, { provide: TOGGLE_BACKGROUND_DEFAULT_COLOR, useValue: 'green' }]
})
export class ProductsModule {}
