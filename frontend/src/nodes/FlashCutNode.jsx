import { $applyNodeReplacement } from 'lexical';

import DefaultActionNode from './DefaultActionNode';
import DefaultParagraphNode from './DefaultParagraphNode';

export const $createFlashcutNode = () =>
  $applyNodeReplacement(new FlashcutNode());

export const $isFlashcutNode = (node) => node instanceof FlashcutNode;

export class FlashcutNode extends DefaultParagraphNode {
  constructor() {
    super();
  }
  createDOM(config) {
    const p = document.createElement('p');
    p.className = config.theme.flashcut;
    p.setAttribute('data-placeholder', 'Flashcut...');
    p.append(document.createTextNode('- flashcut to -'));
    return p;
  }
  updateDOM() {
    return false;
  }

  static clone(node) {
    return new FlashcutNode(node.__key);
  }
  static getType() {
    return 'flashcut';
  }

  static importJSON() {
    return new FlashcutNode();
  }

  exportJSON() {
    return {
      type: 'flashcut',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default FlashcutNode;