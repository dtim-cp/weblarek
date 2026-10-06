import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card, TCategory } from "./Card";
import { categoryMap } from "../../utils/constants";

export interface ICardPreview {
  category: string;
  image: string;
  description: string;
  button: string;
  buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreview> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected cardButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.cardButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );

    this.cardButton.addEventListener("click", () => {
      this.events.emit("card__preview:click");
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as TCategory],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.imageElement.src = value;
    this.imageElement.alt = this.title;
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set button(value: string) {
    this.cardButton.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.cardButton.disabled = value;
  }
}
