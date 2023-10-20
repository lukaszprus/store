import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { map } from 'rxjs/operators';

import { uniq } from 'lodash';

import { Product } from './product';

@Injectable()
export class ProductsService {
  private readonly http = inject(HttpClient);

  // constructor(private readonly http: HttpClient) {}

  getAll(params: { [param: string]: string; } = {}) {
    return this.http.get<Product[]>('/api/products', { params, observe: 'response' });
  }

  getAllBrands() {
    return this.getAll().pipe(
      map(res => uniq(res.body!.map(product => product.brand)))
    );
  }

  getAllCategories() {
    return this.getAll().pipe(
      map(res => uniq(res.body!.map(product => product.category)))
    );
  }
}
