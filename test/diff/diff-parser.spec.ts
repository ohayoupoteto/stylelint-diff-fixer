import { CommandExecutor } from '../../src/command-executor';
import dedent from 'ts-dedent';
import { DiffParser } from '../../src/diff/diff-parser';
import { DiffEachFile } from '../../src/diff/diff.type';

type TestCase = {
  filepaths: string[];
  stdout: string;
  expectedDiffsEachFile: DiffEachFile[];
};

const TEST_CASES: TestCase[] = [
  {
    filepaths: ['test/test-001.scss'],
    stdout: dedent`
diff --git a/test/test-001.scss b/test/test-001.scss
index 4b43187..9b06095 100644
--- a/test/test-001.scss
+++ b/test/test-001.scss
@@ -5,0 +6,4 @@
+
+  .a {
+    color: red;
+  }`,
    expectedDiffsEachFile: [
      {
        hunks: [
          {
            lines: ['', '  .a {', '    color: red;', '  }'],
            lineNumber: { start: 6, count: 4 },
          },
        ],
        filepath: 'test/test-001.scss',
      },
    ],
  },
  {
    filepaths: [
      'test/test-001.scss',
      'test/test-002.scss',
      'test/test-003.css',
    ],
    stdout: dedent`
diff --git a/test/test-001.scss b/test/test-001.scss
index 4b43187..8d8b35d 100644
--- a/test/test-001.scss
+++ b/test/test-001.scss
@@ -5 +4,0 @@
-  display: flex;
diff --git a/test/test-002.scss b/test/test-002.scss
new file mode 100644
index 0000000..707223a
--- /dev/null
+++ b/test/test-002.scss
@@ -0,0 +1,7 @@
+.a {
+  color: red;
+  .b {
+    color: red;
+    background-color: red;
+  }
+}
\\ No newline at end of file
diff --git a/test/test-003.css b/test/test-003.css
index 04af14f..d51e7a0 100644
--- a/test/test-003.css
+++ b/test/test-003.css
@@ -1,0 +2 @@
+    display: block;
@@ -2,0 +4 @@
+    background-color: red;
`,
    expectedDiffsEachFile: [
      {
        hunks: [
          {
            lines: [
              '.a {',
              '  color: red;',
              '  .b {',
              '    color: red;',
              '    background-color: red;',
              '  }',
              '}',
            ],
            lineNumber: { start: 1, count: 7 },
          },
        ],
        filepath: 'test/test-002.scss',
      },
      {
        hunks: [
          {
            lines: ['    display: block;'],
            lineNumber: { start: 2, count: 1 },
          },
          {
            lines: ['    background-color: red;'],
            lineNumber: { start: 4, count: 1 },
          },
        ],
        filepath: 'test/test-003.css',
      },
    ],
  },
];

describe('DiffParser', () => {
  const commandExecutor = new CommandExecutor();

  describe('getDiffsEachFile', () => {
    it.each<TestCase>(TEST_CASES)(
      '正常系_標準出力からDiffHunkを生成できる',
      ({ filepaths, stdout, expectedDiffsEachFile }) => {
        jest
          .spyOn(commandExecutor, 'gitDiffNameonly')
          .mockReturnValue(filepaths.join('\n'));
        jest.spyOn(commandExecutor, 'gitDiff').mockReturnValue(stdout);

        const actualDiffsEachFile = new DiffParser(
          commandExecutor,
        ).getDiffsEachFile('');

        expect(actualDiffsEachFile).toStrictEqual(expectedDiffsEachFile);
      },
    );
  });
});
