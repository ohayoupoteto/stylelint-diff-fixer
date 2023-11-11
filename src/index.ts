import { DiffParser } from './diff-parser';
import { Commander } from './commander';
import { DummyFileHandler } from './dummy-file-handler';

const diffParser = new DiffParser(new Commander());
const diffsEachFile = diffParser.getDiffsEachFile();

const dummyFileHandler = new DummyFileHandler();
dummyFileHandler.write(diffsEachFile);
