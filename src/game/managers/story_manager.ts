import { GameEvents } from "../events/event_bus";
import type { Game } from "../game";

type UnlockCondition = 
  | { type: "divinity"; value: number }
  | { type: "action"; id: string }
  | { type: "time"; value: number }

export type StoryEntry = {
  id: string
  title: string
  content: string
  unlock?: UnlockCondition
  unlocked: boolean
  read: boolean
}

export class StoryManager {
  private entries: Record<string, StoryEntry> = {}
  private hasUnread = false
  private game: Game

  constructor(entries: StoryEntry[], game: Game) {
    entries.forEach(e => {
      this.entries[e.id] = {
        ...e,
        unlocked: false,
        read: false
      }
    })

    this.game = game
    game.events.on(GameEvents.POINTS_GAINED, ({ total }) => {
      this.checkDivinityUnlocks(total)
    })
  }

  // Unlocking Management
  unlock(id: string) {
    const entry = this.entries[id]
    if (!entry || entry.unlocked) return

    entry.unlocked = true
    entry.read = false
    this.hasUnread = true

    this.game.events.emit(GameEvents.STORY_UNLOCKED, { id })
  }

  private checkDivinityUnlocks(divinity: number) {
    Object.values(this.entries).forEach(entry => {
      if (entry.unlocked || !entry.unlock) return

      if (entry.unlock.type === "divinity" && divinity >= entry.unlock.value) {
        this.unlock(entry.id)
      }
    })
  }

  getUnlockedEntries() {
    return Object.values(this.entries).filter(e => e.unlocked)
  }

  // Read Management
  markAllRead() {
    Object.values(this.entries).forEach(e => {
      this.markAsRead(e.id)
    })
    this.hasUnread = false
  }

  markAsRead(id: string) {
    const entry = this.entries[id]
    if (!entry) return

    entry.read = true

    this.hasUnread = Object.values(this.entries).some(
      e => e.unlocked && !e.read
    )
  }

  hasUnreadEntries() {
    return this.hasUnread
  }

  // Serialization Logic
  serialize() {
    return Object.fromEntries(
      Object.entries(this.entries).map(([id, e]) => [
        id,
        { unlocked: e.unlocked, read: e.read }
      ])
    )
  }

  deserialize(data: any) {
    if (!data) return

    Object.entries(data).forEach(([id, saved]: any) => {
      const entry = this.entries[id]
      if (!entry) return

      entry.unlocked = saved.unlocked
      entry.read = saved.read
    })

    this.hasUnread = Object.values(this.entries).some(e => e.unlocked && !e.read)
  }
}

export async function loadStoryData() {
  const res = await fetch("/data/story.json")
  return await res.json()
}