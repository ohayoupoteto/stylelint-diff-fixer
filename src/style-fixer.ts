import { lint } from 'stylelint';
import type { StyleAdjuster } from './style-adjuster';
import { format } from 'prettier';

export class StyleFixer {
  constructor(private readonly styleAdjuster: StyleAdjuster) {}

  async lintWithFix(code: string): Promise<string> {
    let adjustedStyle: string;
    try {
      adjustedStyle = this.styleAdjuster.adjust(code);
    } catch (e) {
      return code;
    }

    const fixedStyle = await lint({ code: adjustedStyle, fix: true });
    const formattedStyle = await format(fixedStyle.output, { parser: 'scss' });

    return this.styleAdjuster.unAdjust(formattedStyle);
  }
}
