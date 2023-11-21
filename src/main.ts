import { CommandExecutor } from './command-executor';
import { DiffParser } from './diff/diff-parser';
import { StyleFixer } from './style/style-fixer';
import { StyleAdjuster } from './style/style-adjuster';
import { CssFileSystem } from './css-file/css-file-system';
import { Logger } from './log/logger';
import { LogStyle } from './log/log-style';
import { CssFileHandler } from './css-file/css-file-handler';

export async function main(filepath: string): Promise<void> {
  const commandExecutor = new CommandExecutor();
  const diffParser = new DiffParser(commandExecutor);

  const diffsEachFile = diffParser.getDiffsEachFile(filepath);
  if (diffsEachFile.length === 0) return;

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
