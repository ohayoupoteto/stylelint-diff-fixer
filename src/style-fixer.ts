import { lint } from 'stylelint';
import { join } from 'path';
import type { StyleAdjuster } from './style-adjuster';

export class StyleFixer {
  constructor(private readonly styleAdjuster: StyleAdjuster) {}

  async lintWithFix(code: string): Promise<string> {
    const fixedStyle = await lint({
      code: this.styleAdjuster.formatForFix(code),
      configBasedir: join(__dirname, '..'),
      fix: true,
    });

    return this.styleAdjuster.unformatForFix(fixedStyle.output);
  }
}
