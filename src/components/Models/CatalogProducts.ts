import { IProduct } from '../../types';

export class CatalogProducts {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor() {};

  setProducts(products: IProduct[]): void {
    this.products = products;
  }

  getProducts(): IProduct[] {
    return [...this.products];
  }

  getProductById(id: string): IProduct | undefined {
    const targetId = String(id);
    return this.products.find(product => String(product.id) === targetId);
  }

  setSelectedProduct(selectedProduct: IProduct): void {
    this.selectedProduct = selectedProduct;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}