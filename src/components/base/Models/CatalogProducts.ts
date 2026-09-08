import { IProduct } from '../../../types';

export class CatalogProducts {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(products: IProduct[], selectedProduct: IProduct | null) {
    this.products = products;
    this.selectedProduct = selectedProduct;
  }

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

  setSelectedProduct(selectedProduct: IProduct | null): void {
    this.selectedProduct = selectedProduct;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}