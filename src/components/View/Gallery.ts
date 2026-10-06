import { Component } from "../base/Component";

export interface IGalleryData {
  items: HTMLElement[];
}

export class Gallery extends Component<IGalleryData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(items: HTMLElement[]) {
    this.container.replaceChildren(...items);
  }
}