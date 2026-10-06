import { ensureElement } from "../../utils/utils";
import { Card, TCategory } from "./Card";
import { categoryMap } from "../../utils/constants";

export interface ICardCatalog {
  category: string;
  image: { src: string; alt: string };
}

export class CardCatalog extends Card<ICardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    this.container.addEventListener("click", onClick);
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

  set image(value: { src: string; alt: string }) {
    this.setImage(this.imageElement, value.src, value.alt);
  }
}
