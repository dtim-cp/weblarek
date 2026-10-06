import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./Form";
import { TPayment } from "../../types";

export interface IOrder extends IForm {
  payment: TPayment | null;
  address: string;
}

export class Order extends Form<IOrder> {
  protected cardElement: HTMLButtonElement;
  protected cashElement: HTMLButtonElement;
  protected inputElement: HTMLInputElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container, events);

    this.cardElement = ensureElement<HTMLButtonElement>(
      '.button[name="card"]',
      this.container,
    );
    this.cashElement = ensureElement<HTMLButtonElement>(
      '.button[name="cash"]',
      this.container,
    );
    this.inputElement = ensureElement<HTMLInputElement>(
      '.form__input[name="address"]',
      this.container,
    );

    this.cardElement.addEventListener("click", () => {
      const field = "payment";
      const value = "card";
      this.onInputChange(field, value);
    });

    this.cashElement.addEventListener("click", () => {
      const field = "payment";
      const value = "cash";
      this.onInputChange(field, value);
    });

    this.inputElement.addEventListener("input", () => {
      const field = "address";
      const value = this.inputElement.value;
      this.onInputChange(field, value);
    });
  }

  set payment(value: TPayment | null) {
    this.cardElement.classList.toggle("button_alt-active", value === "card");
    this.cashElement.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.inputElement.value = value;
  }
}
