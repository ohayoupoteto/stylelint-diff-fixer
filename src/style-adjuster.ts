import { type ChildNode, parse, Rule } from 'postcss';

const WRAPPER_RULE_SELECTOR = '.stylelint-diff-fixer';

export class StyleAdjuster {
  adjust(code: string): string {
    const { raws, nodes } = parse(code);

    // 親にRuleを持たないDeclがある場合でもソートされるように、仮のRuleでラップする
    const wrappedRule = new Rule({
      selector: WRAPPER_RULE_SELECTOR,
      raws: { ...raws, semicolon: true },
      nodes,
    });

    return wrappedRule.toString();
  }

  unAdjust(code: string): string {
    const root = parse(code);

    let fixedNodes: ChildNode[] = [];
    root.walkRules(WRAPPER_RULE_SELECTOR, ({ nodes }) => {
      fixedNodes = nodes;
    });

    root.nodes = fixedNodes;
    root.raws = { semicolon: true };
    return root.toString();
  }
}
