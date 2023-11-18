import {
  type ChildNode,
  CssSyntaxError,
  parse,
  type Root,
  Rule,
} from 'postcss';

const WRAPPER_RULE_SELECTOR = '.stylelint-diff-fixer';

export class StyleAdjuster {
  formatForFix(code: string): string {
    const { raws, nodes } = this.parse(code);

    // 親にRuleを持たないDeclがある場合でもソートされるように、仮のRuleでラップする
    const wrappedRule = new Rule({
      selector: WRAPPER_RULE_SELECTOR,
      raws: { ...raws, semicolon: true },
      nodes,
    });

    return wrappedRule.toString();
  }

  unformatForFix(code: string): string {
    const root = this.parse(code);

    let fixedNodes: ChildNode[] = [];
    root.walkRules(WRAPPER_RULE_SELECTOR, ({ nodes }) => {
      fixedNodes = nodes;
    });

    root.nodes = fixedNodes;
    root.raws = { semicolon: true };
    return root.toString();
  }

  private parse(code: string): Root {
    try {
      return parse(code);
    } catch (e: unknown) {
      if (e instanceof CssSyntaxError) {
        throw new Error(`CSSの構文エラーがあります：${e.message}`);
      }
      throw e;
    }
  }
}
