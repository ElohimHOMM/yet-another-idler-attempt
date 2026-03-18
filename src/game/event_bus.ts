type EventHandler = (payload?: any) => void

export class EventBus {
  private listeners: Record<string, EventHandler[]> = {}

  on(event: string, handler: EventHandler) {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(handler)
  }

  emit(event: string, payload?: any) {
    const handlers = this.listeners[event]
    if (!handlers) return

    handlers.forEach(h => h(payload))
  }
}