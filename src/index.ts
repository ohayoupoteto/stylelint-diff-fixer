#!/usr/bin/env node
import { StyleLinter } from './style-linter';
import { StyleFormatter } from './style-formatter';
import { Commander } from './commander';
import { DiffParser } from './diff-parser';
import { CssFileHandler } from './css-file-handler';

const diffParser = new DiffParser(new Commander());
const diffsEachFile = diffParser.getDiffsEachFile();
if (diffsEachFile.length !== 0) {
  const styleLinter = new StyleLinter(new StyleFormatter());
  const cssFileHandler = new CssFileHandler(styleLinter);
  cssFileHandler.update(diffsEachFile);
}
