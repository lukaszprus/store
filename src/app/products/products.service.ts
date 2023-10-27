import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { map } from 'rxjs/operators';

import { uniq } from 'lodash';

import { Category, Product } from './products';

@Injectable()
export class ProductsService {
  private readonly http = inject(HttpClient);

  getAllProducts(params: { [param: string]: string | number; } = {}) {
    return this.http.get<Product[]>('/api/products', { params, observe: 'response' });
  }

  getProduct(id: number) {
    return this.http.get<Product>('/api/products/' + id);
  }

  getAllBrands() {
    return this.getAllProducts().pipe(
      map(res => uniq(res.body!.map(product => product.brand)))
    );
  }

  getAllCategories() {
    return this.http.get<Category[]>('/api/categories');
  }

  getCategory(id: number) {
    return this.http.get<Category>('/api/categories/' + id);
  }
}
