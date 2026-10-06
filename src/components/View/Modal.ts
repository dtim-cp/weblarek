import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  protected modalButton: HTMLButtonElement;
  protected modalElement: HTMLElement;

  constructor(
    container: HTMLElement,
    protected events: IEvents,
  ) {
    super(container);

    this.modalButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.modalElement = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );

    this.modalButton.addEventListener("click", () => this.closeModal());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) this.closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        this.container.classList.contains("modal_active")
      )
        this.closeModal();
    });
  }

  set content(items: HTMLElement) {
    this.modalElement.replaceChildren(items);
  }

  openModal(): void {
    this.container.classList.add("modal_active");
  }

  closeModal(): void {
    this.container.classList.remove("modal_active");
    this.events.emit("modal:close");
  }
}
