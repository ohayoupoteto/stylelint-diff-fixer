import { lint } from 'stylelint';
import type { StyleAdjuster } from './style-adjuster';

/**
 * Stylelint-fixを実行するクラス
 */
export class StyleFixer {
  constructor(private readonly styleAdjuster: StyleAdjuster) {}

  async fix(code: string): Promise<string> {
    let adjustedStyle: string;
    try {
      adjustedStyle = this.styleAdjuster.wrapInDummyRule(code);
    } catch (e) {
      return code;
    }

    const fixedStyle = await lint({ code: adjustedStyle, fix: true });

    return this.styleAdjuster.unwrapInDummyRule(fixedStyle.output);
  }
}
