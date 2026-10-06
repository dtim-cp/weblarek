import {
  IApi,
  IGetProductsResponse,
  IOrderRequest,
  IOrderResponse,
} from "../../types";

export class OrderService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IGetProductsResponse> {
    return this.api.get<IGetProductsResponse>("/product/");
  }

  async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order/", order);
  }
}
