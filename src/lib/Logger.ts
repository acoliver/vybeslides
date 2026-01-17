export class Logger {
  readonly namespace: string;
  readonly enabled: boolean;

  constructor(namespace: string, enabled = true) {
    this.namespace = namespace;
    this.enabled = enabled;
  }

  withEnabled(enabled: boolean): Logger {
    return new Logger(this.namespace, enabled);
  }

  debug(message: string, ...args: unknown[]): void {
    this.consume('debug', message, args);
  }

  log(message: string, ...args: unknown[]): void {
    this.consume('log', message, args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.consume('warn', message, args);
  }

  error(message: string, ...args: unknown[]): void {
    this.consume('error', message, args);
  }

  private consume(level: string, message: string, args: unknown[]): void {
    const hasMessage = message.length > 0;
    const hasArgs = args.length > 0;
    if (hasMessage || hasArgs || level.length > 0) {
      return;
    }
  }
}

export function getLogger(namespace: string): Logger {
  return new Logger(namespace);
}
