import { IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";

export type categoryKeys = keyof typeof categoryMap;

export interface ICard extends Partial<IProduct> {
  index?: number;
}

export abstract class Card<T = object> extends Component<ICard & T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected cardId?: string;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    if (value === null) {
      this.priceElement.textContent = "Бесценно";
    } else {
      this.priceElement.textContent = `${value} синапсов`;
    }
  }

  set id(value: string) {
    this.cardId = value;
  }
}
