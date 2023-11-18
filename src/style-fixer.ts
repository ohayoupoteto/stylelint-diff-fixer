import { lint } from 'stylelint';
import type { StyleAdjuster } from './style-adjuster';
import { format } from 'prettier';

export class StyleFixer {
  constructor(private readonly styleAdjuster: StyleAdjuster) {}

  async lintWithFix(code: string): Promise<string> {
    const fixedStyle = await lint({
      code: this.styleAdjuster.formatForFix(code),
      fix: true,
    });
    const formattedStyle = await format(fixedStyle.output, {
      parser: 'scss',
    });

    return this.styleAdjuster.unformatForFix(formattedStyle);
  }
}
