export abstract class UIComponent {
  protected root: HTMLElement

  constructor(root: HTMLElement) {
    this.root = root
  }

  init(): void {}
  render(_time: number): void {}
  destroy(): void {}
}