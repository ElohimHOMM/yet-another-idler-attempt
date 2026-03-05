import type { SaveGameData } from "./game"

const STORAGE_KEY = "yaia-save"
const CURRENT_VERSION = 1

export class SaveSystem {

  save(data: SaveGameData) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }

  load(): SaveGameData | null {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    try {
      const parsed = JSON.parse(raw) as SaveGameData

      // Version check for future migrations
      if (!parsed.version || parsed.version !== CURRENT_VERSION) {
        console.warn("Save version mismatch. Resetting save.")
        return null
      }

      return parsed
    } catch {
      console.warn("Failed to parse save. Resetting.")
      return null
    }
  }

  createEmpty(): SaveGameData {
    return {
      version: CURRENT_VERSION,
      points: 0,
    }
  }
}