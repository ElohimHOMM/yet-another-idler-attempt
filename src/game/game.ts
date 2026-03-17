import { ActionManager } from "./action_manager"

export interface SaveGameData {
  version: number
  divinity: number
}

export class Game {
  public divinity: number = 0
  private dirty = true
  actionManager = new ActionManager()

  update(now: number) {
    this.actionManager.update(now)
  }

  addPoints(amount: number) {
    this.divinity += amount
    this.markDirty()
  }

  // Points util
  getPoints(): number {
    return this.divinity
  }

  // Dirty Util
  markDirty() {
    this.dirty = true
  }

  clearDirty() {
    this.dirty = false
  }

  isDirty() {
    return this.dirty
  }

  consumeDirty(): boolean {
    if (this.isDirty()) {
      this.dirty = false
      return true
    }
    return false
  }

  // Save Data Management
  load(data: SaveGameData) {
    this.divinity = data.divinity
  }

  toSaveData(): SaveGameData {
    return {
      version: 1,
      divinity: this.divinity,
    }
  }
}