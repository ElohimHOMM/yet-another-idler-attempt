export abstract class BaseTab {
  protected root: HTMLElement

  constructor(id: string) {
    const el = document.getElementById(id)
    if (!el) throw new Error(`Tab ${id} not found`)
    this.root = el
  }

  abstract init(): void
  abstract render(time: number): void

  onShow(): void {}
  onHide(): void {}
}