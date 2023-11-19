import { StyleAdjuster } from '../src/style-adjuster';
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
  let styleAdjuster: StyleAdjuster;

  beforeAll(() => {
    styleAdjuster = new StyleAdjuster();
  });

  describe('wrapInDummyRule', () => {
    it.each(TEST_STYLES)('', ({ unwrapped, wrapped }) => {
      expect(styleAdjuster.wrapInDummyRule(dedent(unwrapped))).toBe(
        dedent(wrapped),
      );
    });
  });

  describe('unwrapInDummyRule', () => {
    it.each(TEST_STYLES)('', ({ unwrapped, wrapped }) => {
      expect(styleAdjuster.unwrapInDummyRule(dedent(wrapped))).toBe(
        dedent(unwrapped),
      );
    });
  });
});
