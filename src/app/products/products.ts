export interface Product {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  categoryId: number;
  brand: string;
  price: number;
}

export interface Category {
  id: number;
  name: string;
}
