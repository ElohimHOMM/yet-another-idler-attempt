export type Notation = "short" | "scientific" | "engineering"

interface SettingsData {
  notation: Notation
}

const STORAGE_KEY = "yaia-settings"

export class Settings {
  private data: SettingsData

  constructor() {
    this.data = this.load()
  }

  private load(): SettingsData {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { notation: "short" }
    }

    try {
      return JSON.parse(raw) as SettingsData
    } catch {
      return { notation: "short" }
    }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data))
  }

  getNotation(): Notation {
    return this.data.notation
  }

  setNotation(notation: Notation) {
    this.data.notation = notation
    this.save()
  }
}