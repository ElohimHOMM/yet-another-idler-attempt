import { BaseTab } from "./base_tab"
import { Action } from "../../game/action"
import { Game } from "../../game/game"
import { ActionButton } from "../../elements/action_button"
import type { UIComponent } from "../../elements/ui_component"

export class MainTab extends BaseTab {
  private components: UIComponent[] = []
  private game: Game

  constructor(game: Game) {
    super("main")
    this.game = game
  }

  init() {

    const manualButton = new ActionButton(this.root.querySelector("#manual-click")!, () => new Action(5000, () => this.game.addPoints(1)))!
    manualButton.init()
    this.components.push(manualButton)
  }

  render(time: number) {
    this.components.forEach(c => c.render(time))
  }
}