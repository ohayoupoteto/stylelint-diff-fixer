import type { DiffEachFile } from './types/diff.type';
import type { StyleLinter } from './style-linter';
import { readFileSync, writeFileSync } from 'fs';

export class CssFileHandler {
  constructor(private readonly styleLinter: StyleLinter) {}

  async update(diffsEachFile: DiffEachFile[]): Promise<void> {
    for (const { filepath, hunks } of diffsEachFile) {
      const newFileRows = [...readFileSync(filepath).toString().split('\n')];

      for (const {
        rows,
        lineNumber: { start },
      } of hunks) {
        const fixedCode = await this.styleLinter.lintWithFix(rows.join('\n'));
        const fixedCodeRows = fixedCode.split('\n');
        fixedCodeRows.forEach((fixedCodeRow, i) => {
          newFileRows[start + i - 1] = fixedCodeRow;
        });
      }
      writeFileSync(filepath, newFileRows.join('\n'));
    }
  }
}
