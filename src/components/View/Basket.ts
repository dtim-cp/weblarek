import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
  total: number;
  basket: HTMLElement[];
  buttonStatus: boolean;
}

export class Basket extends Component<IBasket> {
  protected basketButtonElement: HTMLButtonElement;
  protected basketContainer: HTMLElement;
  protected totalPriceElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.basketButtonElement = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.basketContainer = ensureElement<HTMLElement>(
      ".basket__list",
      this.container,
    );
    this.totalPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );

    this.basketButtonElement.addEventListener("click", () => {
      this.events.emit("basket:checkout");
    });
  }

  set total(value: number) {
    this.totalPriceElement.textContent = `${value} синапсов`;
  }

  set basket(items: HTMLElement[]) {
    this.basketContainer.replaceChildren(...items);
  }

  set buttonStatus(value: boolean) {
    this.basketButtonElement.disabled = value;
  }
}