import { StyleLinter } from './style-linter';
import { StyleFormatter } from './style-formatter';
import { Commander } from './commander';
import { DiffParser } from './diff-parser';
import { CssFileHandler } from './css-file-handler';

const diffParser = new DiffParser(new Commander());
const diffsEachFile = diffParser.getDiffsEachFile();

const styleLinter = new StyleLinter(new StyleFormatter());
new CssFileHandler(styleLinter).update(diffsEachFile);
