import { IProduct } from '../../types';

export class CartProducts {
  private selectedProducts: IProduct[] = [];

  constructor(selectedProducts: IProduct[]) {
    this.selectedProducts = selectedProducts;
  }

  getSelectedProducts(): IProduct[] {
    return [...this.selectedProducts];
  }

  addSelectedProducts(product: IProduct): void {
    this.selectedProducts.push(product);
  }

  removeSelectedProducts(id: string): void {
    const targetId = String(id);
    this.selectedProducts = this.selectedProducts.filter((prod) => String(prod.id) !== targetId);
  }

  clearCart(): void {
    this.selectedProducts = [];
  }

  getTotalPrice(): number {
    return this.selectedProducts.reduce((sum, prod) => sum + (prod.price || 0), 0);
  }

  getTotalCount(): number {
    return this.selectedProducts.length;
  }

  hasProduct(id: string): boolean {
    const targetId = id;
    return this.selectedProducts.some((prod) => prod.id === targetId);
  }
}