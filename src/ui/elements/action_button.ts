import { UIComponent } from "./ui_component"
import { Action } from "../../game/actions/action"
import type { Game } from "../../game/game"

export class ActionButton extends UIComponent {
  private button: HTMLButtonElement
  private progressBar: HTMLElement
  private game: Game

  private currentAction: Action | null = null
  private createAction: () => Action

  constructor(root: HTMLElement, game: Game, createAction: () => Action) {
    super(root)

    this.game = game
    this.createAction = createAction
    this.button = root as HTMLButtonElement
    this.progressBar = root.querySelector(".progress-bar")!
  }

  init() {
    this.button.addEventListener("click", () => {
      if (this.currentAction?.isActive()) return

      const action = this.createAction()
      this.currentAction = action

      this.game.actionManager.add(action, performance.now())

      this.button.disabled = true
    })
  }

  render(now: number) {
    if (!this.currentAction) return

    const progress = this.currentAction.update(now)

    this.progressBar.style.width = `${progress * 100}%`

    if (!this.currentAction.isActive()) {
      this.button.disabled = false
      this.progressBar.style.width = "0%"
      this.currentAction = null
    }
  }
}