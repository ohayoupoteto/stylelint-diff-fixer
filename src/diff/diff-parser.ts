import type { CommandExecutor } from '../command-executor';
import type { DiffEachFile, DiffHunk } from './diff.type';

const HUNK_HEADER_PATTERN = /@@\s.*\+(\d+)(,(\d+))?\s@@/;

export class DiffParser {
  constructor(private readonly commandExecutor: CommandExecutor) {}

  getDiffsEachFile(filepath: string): DiffEachFile[] {
    this.commandExecutor.gitAddUncommittedFile();

    const filepathsStr = this.commandExecutor.gitDiffNameonly(filepath);
    if (filepathsStr === '') return [];
    const filepaths = filepathsStr.split('\n');

    const diffFileStrs = this.commandExecutor
      .gitDiff(filepath)
      .split(/\ndiff --git .+?\n/);

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
        .filter((line) => line.startsWith('+'))
        .map((line) => line.slice(1));

      return {
        lines: addedRows,
        lineNumber: {
          start: parseInt(startLineNumber),
          count: parseInt(count),
        },
      };
    });
  }
}
