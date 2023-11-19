import type { Commander } from '../commander';
import type { DiffEachFile, DiffHunk } from './diff.type';

const HUNK_HEADER_PATTERN = /@@\s.*\+(\d+)(,(\d+))?\s@@/;

export class DiffParser {
  constructor(private readonly commander: Commander) {}

  getDiffsEachFile(): DiffEachFile[] {
    this.commander.gitAddUncommittedFile();

    const filepathsStr = this.commander.gitDiffNameonly();
    if (filepathsStr === '') return [];
    const filepaths = this.commander.gitDiffNameonly().split('\n');

    const diffFileStrs = this.commander.gitDiff().split(/\ndiff --git .+?\n/);

    return diffFileStrs.map((diff, i) => {
      const diffHunkStrs = diff.split(/\n(?=@@\s.*\s@@.*?\n)/);
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
      const [, startLineNumber, , count] = matches;

      const addedRows = diffHunkStr
        .split('\n')
        .filter((row) => row.startsWith('+'))
        .map((row) => row.slice(1));

      return {
        rows: addedRows,
        lineNumber: {
          start: parseInt(startLineNumber),
          count: parseInt(count),
        },
      };
    });
  }
}
