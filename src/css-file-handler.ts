import type { DiffEachFile } from './types/diff.type';
import type { StyleFixer } from './style-fixer';
import { readFileSync, writeFileSync } from 'fs';

/**
 * CSSファイルに読み書きするクラス
 */
export class CssFileHandler {
  constructor(private readonly styleFixer: StyleFixer) {}

  async update(diffsEachFile: DiffEachFile[]): Promise<void> {
    for (const { filepath, hunks } of diffsEachFile) {
      // そのファイルにおけるfix済の全Hunk
      const fixedHunks: string[] = [];
      for (const { rows } of hunks) {
        const fixedCode = await this.styleFixer.lintWithFix(rows.join('\n'));
        const fixedCodeRows = fixedCode.split('\n');
        fixedHunks.push(fixedCodeRows.join('\n'));
      }

      // 差分開始行の番号
      const startLines = hunks.map(({ lineNumber: { start } }) => start);
      // 差分行の先頭以外の番号
      const toEndLines: number[] = [];
      hunks.forEach(({ lineNumber: { start, count } }) => {
        for (let i = 1; i < count; i++) {
          toEndLines.push(start + i);
        }
      });

      const baseFileRows = readFileSync(filepath).toString().split('\n');
      const newFileRows: (string | null)[] = [];
      let pushedHunkCount = 0;
      baseFileRows.forEach((baseFileRow, i) => {
        if (toEndLines.includes(i + 1)) return;

        if (startLines.includes(i + 1)) {
          newFileRows.push(fixedHunks[pushedHunkCount]);
          pushedHunkCount++;
        } else {
          newFileRows.push(baseFileRow);
        }
      });

      writeFileSync(filepath, newFileRows.join('\n'));
    }
  }
}
