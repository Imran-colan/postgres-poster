type EventHandler<T = any> = (payload: T) => void;

class EventEmitter {
  private events = new Map<string, Set<EventHandler>>();

  subscribe<T>(event: string, handler: EventHandler<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }

    this.events.get(event)!.add(handler);

    // 🔑 return unsubscribe
    return () => {
      this.events.get(event)?.delete(handler);
    };
  }

  emit<T>(event?: string, payload?: T) {
    this.events.get(event || "")?.forEach((handler) => handler(payload));
  }
}

export const appEventEmitter = new EventEmitter();
