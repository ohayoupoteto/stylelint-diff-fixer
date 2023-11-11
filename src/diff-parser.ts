import type { Commander } from './commander';
import type { DiffFile, DiffHunk } from './types/diff.type';

const HUNK_HEADER_PATTERN = /@@\s.*\+(\d+)(,(\d+))?\s@@/;

export class DiffParser {
  constructor(private readonly commander: Commander) {}

  getAddedDiffFiles(): DiffFile[] {
    const filepaths = this.commander.gitDiffNameonly().split('\n');
    const diffFileStrs = this.commander.gitDiff().split(/\ndiff --git .+?\n/);

    return diffFileStrs.map((diff, i) => {
      const diffHunkStrs = diff.split(/\n(?=@@\s.*\s@@\n)/);
      diffHunkStrs.shift(); // headerの削除

      return {
        hunks: this.createDiffHunks(diffHunkStrs),
        filepath: filepaths[i],
      };
    });
  }

  private createDiffHunks(diffHunkStrs: string[]): DiffHunk[] {
    return diffHunkStrs.map((diffHunkStr) => {
      const matches = diffHunkStr.match(HUNK_HEADER_PATTERN);
      if (!matches) throw new Error();
      const [, startLineNumber, , endLineNumber] = matches;

      const addedRows = diffHunkStr
        .split('\n')
        .filter((row) => row.startsWith('+'));

      return {
        rows: addedRows,
        lineNumber: {
          start: parseInt(startLineNumber),
          end: parseInt(endLineNumber),
        },
      };
    });
  }
}
