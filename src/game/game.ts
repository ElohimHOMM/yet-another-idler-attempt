import { ActionManager } from "./managers/action_manager"
import { StoryManager, type StoryEntry } from "./managers/story_manager"
import { EventBus, GameEvents, type GameEventMap } from "./events/event_bus"
import { CurrencyManager } from "./managers/currency_manager"

export interface SaveGameData {
  version: number
  divinity: number
  story: object
}


export class Game {
  private dirty = true
  actionManager = new ActionManager()
  currencies = new CurrencyManager()
  story!: StoryManager
  public events = new EventBus<GameEventMap>()
  
  constructor(storyData: StoryEntry[]) {
    this.story = new StoryManager(storyData, this)
    this.events.emit(GameEvents.POINTS_GAINED, { amount: 0, total: this.currencies.get("divinity")!.amount })
  }

  // update and add
  update(now: number) {
    this.actionManager.update(now)
  }

  // Divinity util
  addDivinity(amount: number) {
    const gained = this.currencies.add("divinity", amount)

    if (gained > 0) {
      this.events.emit(GameEvents.POINTS_GAINED, {
        amount: gained,
        total: this.currencies.get("divinity")!.amount
      })
    }
    
    this.markDirty()
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
    if (!data) return

    this.divinity = data.divinity
    this.story.deserialize(data.story)
  }

  toSaveData(): SaveGameData {
    return {
      version: 1,
      divinity: this.divinity,
      story: this.story.serialize()
    }
  }
}