import type { DiffHunk } from '../diff/diff.type';

export type StyleFixResult = {
  filepath: string;
  fixedHunkCount: number;
};

export type StyleFixedHunk = {
  code: string;
  lineNumber: DiffHunk['lineNumber'];
};

export type BaseCodeRow = { before: string; after: string };
