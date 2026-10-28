export class Logger {
  private static write(level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG', message: string): void {
    if (level === 'DEBUG' && process.env.DEBUG_LOGS !== 'true') return;
    const output = `[${new Date().toISOString()}] [${level}] ${message}`;
    if (level === 'ERROR') console.error(output);
    else if (level === 'WARN') console.warn(output);
    else console.log(output);
  }
  static info(message: string): void {
    this.write('INFO', message);
  }
  static warn(message: string): void {
    this.write('WARN', message);
  }
  static error(message: string): void {
    this.write('ERROR', message);
  }
  static debug(message: string): void {
    this.write('DEBUG', message);
  }
}
