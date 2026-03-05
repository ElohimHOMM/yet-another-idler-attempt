export interface SaveGameData {
  version: number
  points: number
}

export class Game {
  public points: number = 0

  private dirty = true

  update() {
    // still empty
  }

  addPoints(amount: number) {
    this.points += amount
    this.markDirty()
  }

  // Points util
  getPoints(): number {
    return this.points
  }

  // Dirty Util
  markDirty() {
    this.dirty = true
  }

  consumeDirty(): boolean {
    if (this.dirty) {
      this.dirty = false
      return true
    }
    return false
  }

  // Save Data Management
  load(data: SaveGameData) {
    this.points = data.points
  }

  toSaveData(): SaveGameData {
    return {
      version: 1,
      points: this.points,
    }
  }
}