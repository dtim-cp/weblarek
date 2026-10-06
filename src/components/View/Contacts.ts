import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";
import { Form, IForm } from "./Form";

export interface IContacts extends IForm {
  email: string;
  phone: string;
}

export class Contacts extends Form<IContacts> {
  protected emailInputElement: HTMLInputElement;
  protected phoneInputElement: HTMLInputElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInputElement = ensureElement<HTMLInputElement>(
      '.form__input[name="email"]',
      this.container,
    );
    this.phoneInputElement = ensureElement<HTMLInputElement>(
      '.form__input[name="phone"]',
      this.container,
    );

    this.emailInputElement.addEventListener("input", () => {
      this.onInputChange({
        field: "email",
        value: this.emailInputElement.value,
      });
    });

    this.phoneInputElement.addEventListener("input", () => {
      this.onInputChange({
        field: "phone",
        value: this.phoneInputElement.value,
      });
    });
  }

  set email(value: string) {
    this.emailInputElement.value = value;
  }

  set phone(value: string) {
    this.phoneInputElement.value = value;
  }
}
