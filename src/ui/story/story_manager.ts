export type StoryEntry = {
  id: string
  title: string
  content: string
  unlocked: boolean
  read: boolean
}

export class StoryManager {
  private entries: Record<string, StoryEntry> = {}
  private hasUnread = false

  constructor() {
    // Example entry
    this.entries["intro"] = {
      id: "0000",
      title: "A Beginning",
      content: "You feel something stir within...",
      unlocked: false,
      read: false
    }
  }

  unlock(id: string) {
    const entry = this.entries[id]
    if (!entry || entry.unlocked) return

    entry.unlocked = true
    entry.read = false
    this.hasUnread = true
  }

  markAllRead() {
    Object.values(this.entries).forEach(e => {
      if (e.unlocked) e.read = true
    })
    this.hasUnread = false
  }

  hasUnreadEntries() {
    return this.hasUnread
  }

  getUnlockedEntries() {
    return Object.values(this.entries).filter(e => e.unlocked)
  }
}