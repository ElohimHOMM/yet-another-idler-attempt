export class Action {
  private startTime = 0
  private isRunning = false

  public duration: number
  private onComplete: () => void
  public id?: string

  constructor(duration: number, onComplete: () => void, id?: string) {
    this.duration = duration
    this.onComplete = onComplete
    this.id = id
  }

  start(now: number) {
    this.startTime = now
    this.isRunning = true
  }

  update(currentTime: number): number {
    if (!this.isRunning) return 0

    const elapsed = currentTime - this.startTime
    const progress = Math.min(elapsed / this.duration, 1)

    if (progress >= 1) {
      this.isRunning = false
      this.onComplete()
    }

    return progress
  }

  isActive() {
    return this.isRunning
  }
}