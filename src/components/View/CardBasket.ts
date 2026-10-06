import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card } from "./Card";

export interface ICardBasket {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit("basket__item:remove", { id: this.cardId });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
