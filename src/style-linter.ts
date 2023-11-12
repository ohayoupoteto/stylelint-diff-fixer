import { lint } from 'stylelint';
import { join } from 'path';
import type { StyleFormatter } from './style-formatter';

export class StyleLinter {
  constructor(private readonly styleFormatter: StyleFormatter) {}

  async lintWithFix(code: string): Promise<string> {
    const fixedStyle = await lint({
      code: this.styleFormatter.formatForFix(code),
      configBasedir: join(__dirname, '..'),
      fix: true,
    });

    return this.styleFormatter.unformatForFix(fixedStyle.output);
  }
}
