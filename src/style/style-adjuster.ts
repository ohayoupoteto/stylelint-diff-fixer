import { parse, Rule } from 'postcss';

const WRAPPER_RULE_SELECTOR = '.@sdf';

/**
 * Stylelint-fixのためにstyleを整形するクラス
 */
export class StyleAdjuster {
  wrapInDummyRule(code: string): string {
    const { raws, nodes } = parse('\n' + code + '\n');

    // 親にRuleを持たないDeclがある場合でもソートされるように、仮のRuleでラップする
    const wrappedRule = new Rule({
      selector: WRAPPER_RULE_SELECTOR,
      raws: { ...raws, semicolon: true },
    });
    wrappedRule.append(nodes);

    return wrappedRule.toString();
  }

  unwrapInDummyRule(code: string): string {
    return code.replace(`${WRAPPER_RULE_SELECTOR} {\n`, '').replace(/\n}$/, '');
  }
}
