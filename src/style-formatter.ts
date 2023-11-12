import {
  type ChildNode,
  CssSyntaxError,
  parse,
  type Root,
  Rule,
} from 'postcss';

const WRAPPER_RULE_SELECTOR = '.stylelint-diff-fixer';

export class StyleFormatter {
  formatForFix(code: string): string {
    const root = this.parse(code);

    // 親にRuleを持たないDeclがある場合でもソートされるように、仮のRuleでラップする
    root.nodes = [
      new Rule({
        selector: WRAPPER_RULE_SELECTOR,
        nodes: root.nodes,
      }),
    ];
    return root.toString();
  }

  unformatForFix(code: string): string {
    const root = this.parse(code);

    let fixedNodes: ChildNode[] = [];
    root.walkRules(WRAPPER_RULE_SELECTOR, ({ nodes }) => {
      fixedNodes = nodes;
    });

    root.nodes = fixedNodes;
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
