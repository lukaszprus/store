import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductFiltersComponent } from './product-filters/product-filters.component';
import { ProductTileComponent } from './product-tile/product-tile.component';
import { ProductsListComponent } from './products-list/products-list.component';
import { SorterComponent } from '../sorter/sorter.component';
import { ProductsService } from './products.service';
import { TOGGLE_BACKGROUND_DEFAULT_COLOR, ToggleBackgroundDirective } from '../toggle-background.directive';
import { ProductsSearchComponent } from './products-search/products-search.component';
import { SearchLogComponent } from './search-log/search-log.component';

@NgModule({
  declarations: [
    ProductsComponent,
    ProductDetailComponent,
    ProductFiltersComponent,
    ProductTileComponent,
    ProductsListComponent,
    ProductsSearchComponent,
    SearchLogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbPaginationModule,
    MatButtonModule,
    MatIconModule,
    SorterComponent,
    ProductsRoutingModule,
    ToggleBackgroundDirective
  ],
  providers: [ProductsService, { provide: TOGGLE_BACKGROUND_DEFAULT_COLOR, useValue: 'green' }]
})
export class ProductsModule {}
