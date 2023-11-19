import type { StyleFixResult } from './style/style.type';
import type { LogColor } from './log-color';

export class Logger {
  constructor(private readonly logColor: LogColor) {}

  logFixResult({ filepath, fixedHunkCount }: StyleFixResult): void {
    const msgHunkCount = `(${fixedHunkCount} hunk${
      fixedHunkCount > 1 ? 's' : ''
    })`;

    console.info(
      this.logColor.addBgColor(
        this.logColor.addFgColor(' FIX ', 'BLACK_BOLD'),
        'GREEN',
      ),
      filepath,
      this.logColor.addFgColor(msgHunkCount, 'GRAY'),
    );
  }
}
