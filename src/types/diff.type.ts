export type DiffEachFile = {
  hunks: DiffHunk[];
  filepath: string;
};

export type DiffHunk = {
  rows: string[];
  lineNumber: LineNumber;
};

type LineNumber = {
  start: number;
  end: number;
};
