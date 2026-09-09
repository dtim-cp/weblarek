import { IApi, IProduct, IGetProductsResponse, IOrderRequest, IOrderResponse } from '../../../types';

export class OrderService {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  async getProducts(): Promise<IProduct[]> {
    try {
      const response = await this.api.get<IGetProductsResponse>('/product/');
      return response.items;
    } catch (error) {
      console.error('Ошибка при получении товаров:', error);
      throw error;
    }
  }

  async sendOrder(order: IOrderRequest): Promise<IOrderResponse> {
    try {
      return await this.api.post<IOrderResponse>('/order/', order);
    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      throw error;
    }
  }
}