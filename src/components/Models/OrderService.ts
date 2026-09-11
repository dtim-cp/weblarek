import { IApi, IProduct, IGetProductsResponse, IOrderRequest, IOrderResponse } from '../../types';

export class OrderService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    return (await this.api.get<IGetProductsResponse>('/product/')).items;
  }

  async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
    return await this.api.post<IOrderResponse>('/order/', order);
  }
}