export const GameEvents = {
  POINTS_GAINED: "pointsGained",
  STORY_UNLOCKED: "storyUnlocked"
} as const

export type GameEventMap = {
  [GameEvents.POINTS_GAINED]: {
    amount: number
    total: number
  }
  [GameEvents.STORY_UNLOCKED]: {
    id: string
  }
}

export class EventBus<T extends Record<string, any>> {
  private listeners: {
    [K in keyof T]?: ((payload: T[K]) => void)[]
  } = {}

  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event]!.push(handler)
  }

  emit<K extends keyof T>(event: K, payload: T[K]) {
    const handlers = this.listeners[event]
    if (!handlers) return

    handlers.forEach(h => h(payload))
  }
}