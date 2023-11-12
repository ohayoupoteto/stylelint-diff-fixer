import { StyleLinter } from './style-linter';
import { StyleFormatter } from './style-formatter';
import { Commander } from './commander';
import { DiffParser } from './diff-parser';
import { CssFileHandler } from './css-file-handler';

export async function run(): Promise<void> {
  const diffParser = new DiffParser(new Commander());
  const diffsEachFile = diffParser.getDiffsEachFile();
  if (diffsEachFile.length === 0) return;

  const styleLinter = new StyleLinter(new StyleFormatter());
  const cssFileHandler = new CssFileHandler(styleLinter);
  await cssFileHandler.update(diffsEachFile);
}
