import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CartProducts {
  private selectedProducts: IProduct[] = [];

  constructor(protected events: IEvents) {}

  getSelectedProducts(): IProduct[] {
    return [...this.selectedProducts];
  }

  addSelectedProducts(product: IProduct): void {
    if (this.hasProduct(product.id)) return;
    this.selectedProducts.push(product);
    this.events.emit("cart:change");
  }

  removeSelectedProducts(id: string): void {
    this.selectedProducts = this.selectedProducts.filter(
      (prod) => String(prod.id) !== id,
    );
    this.events.emit("cart:change");
  }

  clearCart(): void {
    this.selectedProducts = [];
    this.events.emit("cart:change");
  }

  getTotalPrice(): number {
    return this.selectedProducts.reduce(
      (sum, prod) => sum + (prod.price || 0),
      0,
    );
  }

  getTotalCount(): number {
    return this.selectedProducts.length;
  }

  hasProduct(id: string): boolean {
    return this.selectedProducts.some((prod) => prod.id === id);
  }
}
