import { $applyNodeReplacement } from 'lexical';

import DefaultActionNode from './DefaultActionNode';
import DefaultParagraphNode from './DefaultParagraphNode';

export const $createIntercutNode = () =>
  $applyNodeReplacement(new IntercutNode());

export const $isIntercutNode = (node) => node instanceof IntercutNode;

export class IntercutNode extends DefaultParagraphNode {
  constructor() {
    super();
  }
  createDOM(config) {
    const p = document.createElement('p');
    p.className = config.theme.intercut;
    p.setAttribute('data-placeholder', 'Intercut...');
    p.append(document.createTextNode('- intercut with -'));
    return p;
  }
  updateDOM() {
    return false;
  }

  static clone(node) {
    return new IntercutNode(node.__key);
  }
  static getType() {
    return 'intercut';
  }

  static importJSON() {
    return new IntercutNode();
  }

  exportJSON() {
    return {
      type: 'intercut',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default IntercutNode;
