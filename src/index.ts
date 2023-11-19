#!/usr/bin/env node
import { StyleFixer } from './style/style-fixer';
import { StyleAdjuster } from './style/style-adjuster';
import { Commander } from './commander';
import { DiffParser } from './diff/diff-parser';
import { CssFileHandler } from './css-file-handler';
import { Logger } from './logger';
import { LogColor } from './log-color';

const diffParser = new DiffParser(new Commander());
const diffsEachFile = diffParser.getDiffsEachFile();
if (diffsEachFile.length !== 0) {
  const styleFixer = new StyleFixer(new StyleAdjuster());
  const logger = new Logger(new LogColor());

  const cssFileHandler = new CssFileHandler(styleFixer, logger);
  cssFileHandler.update(diffsEachFile);
}
