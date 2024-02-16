import { $applyNodeReplacement } from 'lexical';

import DefaultActionNode from './DefaultActionNode';
import DefaultParagraphNode from './DefaultParagraphNode';

export const $createCutbackNode = () =>
  $applyNodeReplacement(new CutbackNode());

export const $isCutbackNode = (node) => node instanceof CutbackNode;

export class CutbackNode extends DefaultParagraphNode {
  constructor() {
    super();
  }
  createDOM(config) {
    const p = document.createElement('p');
    p.className = config.theme.cutback;
    p.setAttribute('data-placeholder', 'Cutback...');
    p.append(document.createTextNode('- cutback to -'));
    return p;
  }
  updateDOM() {
    return false;
  }

  static clone(node) {
    return new CutbackNode(node.__key);
  }
  static getType() {
    return 'cutback';
  }

  static importJSON() {
    return new CutbackNode();
  }

  exportJSON() {
    return {
      type: 'cutback',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default CutbackNode;