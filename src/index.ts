#!/usr/bin/env node
import { StyleFixer } from './style/style-fixer';
import { StyleAdjuster } from './style/style-adjuster';
import { CommandExecutor } from './command-executor';
import { DiffParser } from './diff/diff-parser';
import { CssFileHandler } from './css-file-handler';
import { Logger } from './logger';
import { LogStyle } from './log-style';
import { CssFileSystem } from './css-file-system';

const diffParser = new DiffParser(new CommandExecutor());
const diffsEachFile = diffParser.getDiffsEachFile();
if (diffsEachFile.length !== 0) {
  const styleFixer = new StyleFixer(new StyleAdjuster());
  const cssFileSystem = new CssFileSystem();
  const logger = new Logger(new LogStyle());

  const cssFileHandler = new CssFileHandler(styleFixer, cssFileSystem, logger);
  cssFileHandler.update(diffsEachFile);
}
