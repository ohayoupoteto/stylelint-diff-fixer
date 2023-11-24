import { CommandExecutor } from './modules/command-executor';
import { DiffParser } from './modules/diff/diff-parser';
import { StyleFixer } from './modules/style/style-fixer';
import { StyleAdjuster } from './modules/style/style-adjuster';
import { CssFileSystem } from './modules/css-file/css-file-system';
import { Logger } from './modules/log/logger';
import { LogStyle } from './modules/log/log-style';
import { CssFileHandler } from './modules/css-file/css-file-handler';
import { isEmptyArray } from './utils/array';

export async function main(filepath: string): Promise<void> {
  const commandExecutor = new CommandExecutor();
  const diffParser = new DiffParser(commandExecutor);

  const diffsEachFile = diffParser.getDiffsEachFile(filepath);
  if (isEmptyArray(diffsEachFile)) return;

  const styleFixer = new StyleFixer(new StyleAdjuster());
  const cssFileSystem = new CssFileSystem();
  const logger = new Logger(new LogStyle());

  const cssFileHandler = new CssFileHandler(
    styleFixer,
    cssFileSystem,
    logger,
    commandExecutor.gitRootPath(),
  );
  await cssFileHandler.writeToDiffLines(diffsEachFile);
}
