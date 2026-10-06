export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "card" | "cash";

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type TBuyerErrors = Partial<Record<keyof IBuyer, string>>;

export interface IGetProductsResponse {
  total: number;
  items: IProduct[];
}

export interface IOrderRequest extends Omit<IBuyer, "payment"> {
  total: number;
  items: string[];
  payment: TPayment;
}

export interface IOrderResponse {
  id: string;
  total: number;
}
