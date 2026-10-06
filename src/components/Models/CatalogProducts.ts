import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class CatalogProducts {
  private products: IProduct[] = [];
  private selectedProduct: IProduct | null = null;

  constructor(protected events: IEvents) {}

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events.emit("catalog:change");
  }

  getProducts(): IProduct[] {
    return [...this.products];
  }

  getProductById(id: string): IProduct | undefined {
    const targetId = String(id);
    return this.products.find((product) => String(product.id) === targetId);
  }

  setSelectedProduct(selectedProduct: IProduct): void {
    this.selectedProduct = selectedProduct;
    this.events.emit("card:selected");
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
