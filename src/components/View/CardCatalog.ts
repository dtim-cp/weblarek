import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Card, categoryKeys } from "./Card";
import { IProduct } from "../../types";
import { categoryMap } from "../../utils/constants";

export class CardCatalog extends Card<IProduct> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

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

    this.container.addEventListener("click", () => {
      this.events.emit("card__catalog:click", { id: this.cardId });
    });
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as categoryKeys],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.imageElement.src = value;
    this.imageElement.alt = this.titleElement.textContent ?? "";
  }
}
