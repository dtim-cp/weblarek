import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected successButton: HTMLButtonElement;
  protected successElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.successButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.successElement = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );

    this.successButton.addEventListener("click", () => {
      this.events.emit("success:agree");
    });
  }

  set total(value: number) {
    this.successElement.textContent = `Списано ${value} синапсов`;
  }
}
