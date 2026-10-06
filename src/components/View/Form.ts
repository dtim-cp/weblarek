import { TPayment } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export type TFormChange =
  | { field: "payment"; value: TPayment }
  | { field: "address" | "email" | "phone"; value: string };

export interface IForm {
  error: string;
  buttonStatus: boolean;
}

export abstract class Form<T = object> extends Component<IForm & T> {
  protected errorElement: HTMLElement;
  protected formButtonElement: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
    this.formButtonElement = ensureElement<HTMLButtonElement>(
      ".modal__actions .button",
      this.container,
    );

    this.container.addEventListener("submit", (e: Event) => {
      e.preventDefault();
      this.events.emit(`${this.container.getAttribute("name")}:submit`);
    });
  }

  set error(value: string) {
    this.errorElement.textContent = value;
  }

  set buttonStatus(value: boolean) {
    this.formButtonElement.disabled = value;
  }

  onInputChange(data: TFormChange) {
    this.events.emit<TFormChange>("form:change", data);
  }
}
