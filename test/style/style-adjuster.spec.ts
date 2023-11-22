import { StyleAdjuster } from '../../src/style/style-adjuster';
import dedent from 'ts-dedent';

type TestStyle = { unwrapped: string; wrapped: string };

const TEST_STYLES: TestStyle[] = [
  {
    unwrapped: `
    .a {
      color: red;
    }`,
    wrapped: `
    .@style-diff-fixer {
    .a {
      color: red;
    }
    }`,
  },
  {
    unwrapped: `
    color: red;
    background-color: red;`,
    wrapped: `
    .@style-diff-fixer {
    color: red;
    background-color: red;
    }`,
  },
  {
    unwrapped: `
    .a {
      color: red;
    }
    color: red;
    background-color: red;`,
    wrapped: `
    .@style-diff-fixer {
    .a {
      color: red;
    }
    color: red;
    background-color: red;
    }`,
  },
];

describe('StyleAdjuster', () => {
  const styleAdjuster = new StyleAdjuster();

  describe('wrapInDummyRule', () => {
    it.each(TEST_STYLES)(
      '正常系_ダミーのRuleでラップされる',
      ({ unwrapped, wrapped }) => {
        expect(styleAdjuster.wrapInDummyRule(dedent(unwrapped))).toBe(
          dedent(wrapped),
        );
      },
    );
  });

  describe('unwrapInDummyRule', () => {
    it.each(TEST_STYLES)(
      '正常系_ラップされたダミーのRuleが削除される',
      ({ unwrapped, wrapped }) => {
        expect(styleAdjuster.unwrapInDummyRule(dedent(wrapped))).toBe(
          dedent(unwrapped),
        );
      },
    );
  });
});
