import { ActionManager } from "./managers/action_manager"
import { StoryManager, type StoryEntry } from "./managers/story_manager"
import { EventBus, GameEvents, type GameEventMap } from "./events/event_bus"

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
  public events = new EventBus<GameEventMap>()
  
  constructor(storyData: StoryEntry[]) {
    this.story = new StoryManager(storyData, this)
    this.events.emit(GameEvents.POINTS_GAINED, { amount: 0, total: this.divinity })
  }

  // temp stuff
  actionDuration = 5000 // ms (default 5s)

  buyFasterAction() {
    const cost = 5

    if (this.divinity < cost) return false

    this.divinity -= cost
    this.actionDuration -= 1000 // -1 second

    this.markDirty()
    return true
  }

  // update and add
  update(now: number) {
    this.actionManager.update(now)
  }

  // Points util
  addPoints(amount: number) {
    this.divinity += amount

    this.events.emit(GameEvents.POINTS_GAINED, {
      amount,
      total: this.divinity
    })
    
    this.markDirty()
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