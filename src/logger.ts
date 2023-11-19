import type { StyleFixResult } from './style/style.type';
import type { LogStyle } from './log-style';

export class Logger {
  constructor(private readonly logStyle: LogStyle) {}

  logFixResult({ filepath, fixedHunkCount }: StyleFixResult): void {
    const msgHunkCount = `(${fixedHunkCount} hunk${
      fixedHunkCount > 1 ? 's' : ''
    })`;

    console.info(
      this.logStyle.setColor(
        this.logStyle.setWeight(
          this.logStyle.setColor(' FIX ', 'FG_BLACK'),
          'BOLD',
        ),
        'BG_GREEN',
      ),
      filepath,
      this.logStyle.setWeight(msgHunkCount, 'THIN'),
    );
  }
}
