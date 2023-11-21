import type { CommandExecutor } from '../command-executor';
import type { DiffEachFile, DiffHunk } from './diff.type';
import { isEmptyArray } from '../utils/array';

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

    return diffFileStrs
      .map((diff, i) => {
        const diffHunkStrs = diff.split(/\n(?=@@\s.*\s@@.*?\n)/);
        diffHunkStrs.shift(); // headerの削除

        const hunks = this.createDiffHunks(diffHunkStrs);
        if (isEmptyArray(hunks)) return;

        return {
          hunks,
          filepath: filepaths[i],
        };
      })
      .filter(
        (
          diffEachFile,
        ): diffEachFile is Exclude<typeof diffEachFile, undefined> =>
          diffEachFile !== undefined,
      );
  }

  private createDiffHunks(diffHunkStrs: string[]): DiffHunk[] {
    return diffHunkStrs
      .map((diffHunkStr) => {
        const matches = diffHunkStr.match(HUNK_HEADER_PATTERN);
        if (!matches) throw new Error();
        const [, startLineNumber, , count] = matches;

        const addedRows = diffHunkStr
          .split('\n')
          .filter((line) => line.startsWith('+'))
          .map((line) => line.slice(1));
        if (isEmptyArray(addedRows)) return;

        return {
          lines: addedRows,
          lineNumber: {
            start: parseInt(startLineNumber),
            count: count === undefined ? 1 : parseInt(count),
          },
        };
      })
      .filter(
        (hunk): hunk is Exclude<typeof hunk, undefined> => hunk !== undefined,
      );
  }
}
