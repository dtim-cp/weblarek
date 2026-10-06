import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IBasket {
  total: number;
  basket: HTMLElement[];
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
    if (items.length === 0) {
      const description = document.createElement("P");
      description.textContent = "Корзина пуста";
      this.basketContainer.replaceChildren(description);
      this.basketButtonElement.disabled = true;
    } else {
      this.basketContainer.replaceChildren(...items);
      this.basketButtonElement.disabled = false;
    }
  }

  set buttonStatus(value: boolean) {
    this.basketButtonElement.disabled = value;
  }
}
