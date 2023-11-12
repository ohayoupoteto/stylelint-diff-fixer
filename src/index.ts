import { StyleLinter } from './style-linter';
import { StyleFormatter } from './style-formatter';
import { Commander } from './commander';
import { DiffParser } from './diff-parser';

const diffParser = new DiffParser(new Commander());
const diffsEachFile = diffParser.getDiffsEachFile();

const styleLinter = new StyleLinter(new StyleFormatter());
diffsEachFile.forEach((diffEachFile) => {});
