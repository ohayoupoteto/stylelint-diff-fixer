import { DiffParser } from './diff-parser';
import { Commander } from './commander';

const diffParser = new DiffParser(new Commander());
console.log(diffParser.getAddedDiffFiles());
