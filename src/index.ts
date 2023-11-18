#!/usr/bin/env node
import { StyleFixer } from './style-fixer';
import { StyleAdjuster } from './style-adjuster';
import { Commander } from './commander';
import { DiffParser } from './diff-parser';
import { CssFileHandler } from './css-file-handler';

const diffParser = new DiffParser(new Commander());
const diffsEachFile = diffParser.getDiffsEachFile();
if (diffsEachFile.length !== 0) {
  const styleFixer = new StyleFixer(new StyleAdjuster());
  const cssFileHandler = new CssFileHandler(styleFixer);
  cssFileHandler.update(diffsEachFile);
}
