import { lint } from 'stylelint';
import { join } from 'path';
import type { StyleFormatter } from './style-formatter';

export class StyleLinter {
  constructor(private readonly styleFormatter: StyleFormatter) {}

  async lintWithFix(): Promise<string> {
    const code = `
      .a {
        color: 0px;
        margin-bottom: 10px;
      }
        color: 0px;
        margin-bottom: 10px;
      `;

    const fixedStyle = await lint({
      code: this.styleFormatter.formatForFix(code),
      configBasedir: join(__dirname, '..'),
      fix: true,
    });

    return this.styleFormatter.unformatForFix(fixedStyle.output);
  }
}
