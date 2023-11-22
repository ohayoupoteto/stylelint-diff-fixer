import { type ChildNode, parse, Root, Rule } from 'postcss';
import type { BaseCodeRow } from './style.type';

const WRAPPER_RULE_SELECTOR = '.@sdf';

/**
 * Stylelint-fixのためにstyleを整形するクラス
 */
export class StyleAdjuster {
  /** 整形前におけるコード前後の文字列 */
  private baseCodeRows: BaseCodeRow = { before: '', after: '' };

  /**
   * ダミーのRuleでラップする（親Ruleを持たないDeclがある場合を考慮）
   */
  wrapInDummyRule(code: string): string {
    const { raws, nodes } = parse(code);
    this.baseCodeRows = {
      before: nodes[0].raws.before || '',
      after: raws.after || '',
    };

    // 前後に改行を追加
    nodes[0].raws.before = '\n' + nodes[0].raws.before;
    raws.after += '\n';

    const wrappedRule = new Rule({
      selector: WRAPPER_RULE_SELECTOR,
      raws: { ...raws, semicolon: true },
    });
    wrappedRule.append(nodes);

    return wrappedRule.toString();
  }

  /**
   * ラップしたダミーのRuleを削除する
   */
  unwrapInDummyRule(code: string): string {
    const root = parse(code);
    let wrappedNodes: ChildNode[] = [];
    root.walkRules(WRAPPER_RULE_SELECTOR, ({ nodes }) => {
      wrappedNodes = nodes;
    });

    const newRoot = new Root({
      nodes: wrappedNodes.map((node) => node.clone()),
      raws: { semicolon: true, after: this.baseCodeRows.after },
    });
    newRoot.nodes[0].raws.before = this.baseCodeRows.before;

    return newRoot.toString();
  }
}
