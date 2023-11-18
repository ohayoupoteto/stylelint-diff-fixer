import { type ChildNode, parse, Root, Rule } from 'postcss';

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
    let fixedNodes: ChildNode[] = [];
    parse(code).walkRules(WRAPPER_RULE_SELECTOR, ({ nodes }) => {
      fixedNodes = nodes;
    });

    fixedNodes[0].raws.before = fixedNodes[0].raws.before?.replace(/^\n/, '');
    const newRoot = new Root({ nodes: fixedNodes, raws: { semicolon: true } });

    return newRoot.toString();
  }
}
