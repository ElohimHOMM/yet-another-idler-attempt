import { Action } from "../actions/action"

export class ActionManager {
  private actions: Action[] = []

  add(action: Action, now: number) {
    action.start(now)
    this.actions.push(action)
  }

  update(now: number) {
    this.actions = this.actions.filter(action => {
      action.update(now)
      return action.isActive()
    })
  }

  getActions() {
    return this.actions
  }
}