import EventEmitter2 from 'eventemitter2';

class TypedEmitter<TEvents extends Record<string, any>> {
  private emitter = new EventEmitter2({ wildcard: true });

  emit<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    ...eventArg: TEvents[TEventName]
  ) {
    this.emitter.emit(eventName, ...(eventArg as []));
  }

  on<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ) {
    this.emitter.on(eventName, handler as any);
  }

  off<TEventName extends keyof TEvents & string>(
    eventName: TEventName,
    handler: (...eventArg: TEvents[TEventName]) => void,
  ) {
    this.emitter.off(eventName, handler as any);
  }

  removeAllListeners() {
    this.emitter.removeAllListeners();
  }
}

type WhatsappEvents = {
  '*': [event: string];
  qr: [qr: string];
  error: [error: string];
  reconnect: [];
  scannedQr: [];
  open: [open: string];
  closed: [];
};

export const WhatsappEventEmitter = () => new TypedEmitter<WhatsappEvents>();
export type WhatsappEventEmitterType = ReturnType<typeof WhatsappEventEmitter>;
