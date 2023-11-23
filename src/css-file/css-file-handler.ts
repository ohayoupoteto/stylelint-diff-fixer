import type { DiffEachFile } from '../diff/diff.type';
import type { StyleFixer } from '../style/style-fixer';
import type { Logger } from '../log/logger';
import type { StyleFixedHunk } from '../style/style.type';
import type { CssFileSystem } from './css-file-system';
import { isEmptyArray } from '../utils/array';

/**
 * CSSファイルに読み書きするクラス
 */
export class CssFileHandler {
  constructor(
    private readonly styleFixer: StyleFixer,
    private readonly cssFileSystem: CssFileSystem,
    private readonly logger: Logger,
    private readonly rootFullPath: string,
  ) {}

  async writeToDiffLines(diffsEachFile: DiffEachFile[]): Promise<void> {
    for (const { filepath, hunks } of diffsEachFile) {
      // そのファイルにおけるfix済の全Hunk
      const fixedHunks: StyleFixedHunk[] = [];
      for (const { lines, lineNumber } of hunks) {
        const code = lines.join('\n');
        const fixedCode = await this.styleFixer.fix(code);
        if (code !== fixedCode) {
          fixedHunks.push({ code: fixedCode, lineNumber });
        }
      }
      if (isEmptyArray(fixedHunks)) continue;

      // 差分開始行の番号
      const startLines = fixedHunks.map(({ lineNumber: { start } }) => start);
      // 差分行の先頭以外の番号
      const toEndLines: number[] = [];
      fixedHunks.forEach(({ lineNumber: { start, count } }) => {
        for (let i = 1; i < count; i++) {
          toEndLines.push(start + i);
        }
      });

      const fullFilepath = `${this.rootFullPath}/${filepath}`;

      const baseFileRows = this.cssFileSystem
        .read(fullFilepath)
        .toString()
        .split('\n');
      const newFileRows: string[] = [];
      let pushedHunkCount = 0;

      baseFileRows.forEach((baseFileRow, i) => {
        if (toEndLines.includes(i + 1)) return;

        if (startLines.includes(i + 1)) {
          newFileRows.push(fixedHunks[pushedHunkCount].code);
          pushedHunkCount++;
        } else {
          newFileRows.push(baseFileRow);
        }
      });

      this.cssFileSystem.write(fullFilepath, newFileRows.join('\n'));
      this.logger.logFixResult({ filepath, fixedHunkCount: fixedHunks.length });
    }
  }
}
