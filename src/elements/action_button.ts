import { UIComponent } from "./ui_component"
import { Action } from "../game/action"

export class ActionButton extends UIComponent {
  private button: HTMLButtonElement
  private progressBar: HTMLElement
  private action: Action | null = null
  private createAction: () => Action

  constructor(root: HTMLElement, createAction: () => Action) {
    super(root)

    this.createAction = createAction
    this.button = root as HTMLButtonElement
    this.progressBar = root.querySelector(".progress-bar")!
  }

  init() {
    this.button.addEventListener("click", () => {
      if (this.action?.isActive()) return

      this.action = this.createAction()
      this.action.start()

      this.button.disabled = true
    })
  }

  render(time: number) {
    if (!this.action) return

    const progress = this.action.update(time)
    this.progressBar.style.width = `${progress * 100}%`

    if (!this.action.isActive()) {
      this.button.disabled = false
      this.progressBar.style.width = "0%"
      this.action = null
    }
  }
}