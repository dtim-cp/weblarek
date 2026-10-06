import { ensureElement } from "../../utils/utils";
import { Card } from "./Card";

export interface ICardBasket {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {
  protected indexElement: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.cardButton.addEventListener("click", onClick);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
