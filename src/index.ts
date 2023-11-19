#!/usr/bin/env node
import { StyleFixer } from './style/style-fixer';
import { StyleAdjuster } from './style/style-adjuster';
import { CommandExecutor } from './command-executor';
import { DiffParser } from './diff/diff-parser';
import { CssFileHandler } from './css-file/css-file-handler';
import { Logger } from './log/logger';
import { LogStyle } from './log/log-style';
import { CssFileSystem } from './css-file/css-file-system';

const commandExecutor = new CommandExecutor();
const diffParser = new DiffParser(commandExecutor);
const diffsEachFile = diffParser.getDiffsEachFile();
if (diffsEachFile.length !== 0) {
  const styleFixer = new StyleFixer(new StyleAdjuster());
  const cssFileSystem = new CssFileSystem();
  const logger = new Logger(new LogStyle());

  const cssFileHandler = new CssFileHandler(
    styleFixer,
    cssFileSystem,
    logger,
    commandExecutor.gitRootPath(),
  );
  cssFileHandler.update(diffsEachFile);
}
