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
        lineNumber: { start, end },
      } of hunks) {
        const fixedCode = await this.styleLinter.lintWithFix(rows.join('\n'));
        const fixedCodeRows = fixedCode.split('\n');

        for (let j = start - 1; j < end; j++) {
          newFileRows[j] = fixedCodeRows[j];
        }
      }
      writeFileSync(filepath, newFileRows.join('\n'));
    }
  }
}
