import type { DiffEachFile } from './types/diff.type';
import { DummyFile } from './dummy-file';
import { createHash } from 'crypto';
import { writeFileSync } from 'fs';

/**
 * Lint用の一時的なファイルの読み書きをするクラス
 */
export class DummyFileHandler {
  write(diffsEachFile: DiffEachFile[]): DummyFile[] {
    const dummyFiles: DummyFile[] = [];
    diffsEachFile.forEach(({ filepath, hunks }) => {
      hunks.forEach(({ rows, lineNumber: { start } }) => {
        const dummyFile = new DummyFile(
          this.createPath(filepath, start),
          rows.join('\n'),
        );
        dummyFiles.push(dummyFile);
      });
    });

    // 書き込み
    dummyFiles.forEach(({ path, data }) => {
      writeFileSync(path, data);
    });

    return dummyFiles;
  }

  private createPath(basePath: string, id: number): string {
    return (
      'diff-lint' + createHash('md5').update(basePath).digest('hex') + `-${id}`
    );
  }
}
