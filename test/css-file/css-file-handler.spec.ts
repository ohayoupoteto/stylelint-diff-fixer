import { DiffEachFile } from '../../src/diff/diff.type';
import { StyleFixer } from '../../src/style/style-fixer';
import { Logger } from '../../src/log/logger';
import { CssFileSystem } from '../../src/css-file/css-file-system';
import { CssFileHandler } from '../../src/css-file/css-file-handler';
import dedent from 'ts-dedent';

jest.mock('../../src/style/style-fixer');
jest.mock('../../src/css-file/css-file-system');
jest.mock('../../src/log/logger');

type TestCase = {
  diffsEachFile: DiffEachFile[];
  fixedStyle: string;
  baseFileContent: string;
  expectedValues: {
    fixCounts: number[];
    writeCode: string;
  };
};

const TEST_CASE: TestCase[] = [
  {
    // 単一Hunk
    diffsEachFile: [
      {
        hunks: [
          {
            lines: dedent`
            .a {
              margin: 0px;
            }`.split('\n'),
            lineNumber: { start: 1, count: 3 },
          },
        ],
        filepath: 'test/test-001.scss',
      },
    ],
    fixedStyle: dedent`
    .a {
      margin: 0;
    }`,
    baseFileContent: '',
    expectedValues: {
      fixCounts: [1],
      writeCode: dedent`
      .a {
        margin: 0;
      }`,
    },
  },
  {
    // 複数Hunk
    diffsEachFile: [
      {
        hunks: [
          {
            lines: dedent`
            .a {
              margin: 0px;
            }`.split('\n'),
            lineNumber: { start: 1, count: 3 },
          },
          {
            lines: dedent`
            .a {
              margin: 0px;
            }`.split('\n'),
            lineNumber: { start: 5, count: 3 },
          },
        ],
        filepath: 'test/test-001.scss',
      },
    ],
    fixedStyle: dedent`
    .a {
      margin: 0;
    }`,
    baseFileContent: '\n\n\n\n',
    expectedValues: {
      fixCounts: [2],
      writeCode: dedent`
      .a {
        margin: 0;
      }
      
      .a {
        margin: 0;
      }`,
    },
  },
  {
    // 複数ファイル
    diffsEachFile: [
      {
        hunks: [
          {
            lines: dedent`
            .a {
              margin: 0px;
            }`.split('\n'),
            lineNumber: { start: 1, count: 3 },
          },
        ],
        filepath: 'test/test-001.scss',
      },
      {
        hunks: [
          {
            lines: dedent`
            .a {
              margin: 0px;
            }`.split('\n'),
            lineNumber: { start: 1, count: 3 },
          },
        ],
        filepath: 'test/test-002.scss',
      },
    ],
    fixedStyle: dedent`
    .a {
      margin: 0;
    }`,
    baseFileContent: '',
    expectedValues: {
      fixCounts: [1, 1],
      writeCode: dedent`
      .a {
        margin: 0;
      }`,
    },
  },
];

describe('CssFileHandler', () => {
  const styleFixerMock = StyleFixer as jest.Mock;
  const cssFileSystemMock = CssFileSystem as jest.Mock;
  const loggerMock = Logger as jest.Mock;

  beforeEach(() => {
    styleFixerMock.mockClear();
    cssFileSystemMock.mockClear();
    loggerMock.mockClear();
  });

  it.each<TestCase>(TEST_CASE)(
    '正常系_ファイル毎の差分行を対象ファイルに書き込む',
    async ({ diffsEachFile, fixedStyle, baseFileContent, expectedValues }) => {
      // prepare
      const fix = jest.fn().mockResolvedValue(fixedStyle);
      styleFixerMock.mockImplementationOnce(() => ({ fix }));

      const write = jest.fn();
      const read = jest.fn().mockReturnValue(Buffer.from(baseFileContent));
      cssFileSystemMock.mockImplementationOnce(() => ({ read, write }));

      const logFixResult = jest.fn();
      loggerMock.mockImplementationOnce(() => ({ logFixResult }));

      // run
      const cssFileHandler = new CssFileHandler(
        styleFixerMock(),
        cssFileSystemMock(),
        loggerMock(),
        'root',
      );
      await cssFileHandler.writeToDiffLines(diffsEachFile);

      // assert
      expect(read).toBeCalledTimes(diffsEachFile.length);
      expect(logFixResult).toBeCalledTimes(diffsEachFile.length);
      expect(write).toBeCalledTimes(diffsEachFile.length);

      diffsEachFile.forEach(({ filepath, hunks }, i) => {
        expect(read).nthCalledWith(i + 1, 'root/' + filepath);
        expect(logFixResult).nthCalledWith(i + 1, {
          filepath,
          fixedHunkCount: expectedValues.fixCounts[i],
        });
        expect(write).nthCalledWith(
          i + 1,
          'root/' + filepath,
          expectedValues.writeCode,
        );
      });
    },
  );
});
