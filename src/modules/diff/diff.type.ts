export type DiffEachFile = {
  hunks: DiffHunk[];
  filepath: string;
};

export type DiffHunk = {
  lines: string[];
  lineNumber: LineNumber;
};

type LineNumber = {
  start: number;
  count: number;
};
