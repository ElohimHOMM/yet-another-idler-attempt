import { ActionManager } from "./action_manager"
import { StoryManager, type StoryEntry } from "./story_manager"
import { EventBus } from "./event_bus"

export interface SaveGameData {
  version: number
  divinity: number
  story: object
}

export class Game {
  public divinity: number = 0
  private dirty = true
  actionManager = new ActionManager()
  story!: StoryManager
  public events = new EventBus()
  
  constructor(storyData: StoryEntry[]) {
    this.story = new StoryManager(storyData, this)
    this.story.checkUnlocks(this)
  }

  // update and add
  update(now: number) {
    this.actionManager.update(now)
  }

  // Points util
  addPoints(amount: number) {
    this.divinity += amount
    this.markDirty()

    this.events.emit("pointsGained", {
      amount,
      total: this.divinity
    })
  }

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