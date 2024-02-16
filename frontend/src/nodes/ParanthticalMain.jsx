import { $applyNodeReplacement } from 'lexical';

import DefaultActionNode from './DefaultActionNode';
import DefaultParagraphNode from './DefaultParagraphNode';

export const $createParentheticalMainNode = () =>
  $applyNodeReplacement(new ParentheticalMainNode());

export const $isParentheticalMainNode = (node) => node instanceof ParentheticalMainNode;

export class ParentheticalMainNode extends DefaultParagraphNode {
  constructor() {
    super();
  }

  createDOM(config) {
    const container = document.createElement('div');
    container.className = 'parentheticalMain';

    const textContent = document.createElement('span');
    textContent.className = 'parentheticalMainSpan';
    textContent.setAttribute('data-placeholder', 'Insert your parenthetical text here');

    container.append(textContent);
    return container;
  }

  updateDOM() {
    return false;
  }

  static clone(node) {
    return new ParentheticalMainNode(node.__key);
  }
  static getType() {
    return 'parentheticalMain';
  }

  static importJSON() {
    return new ParentheticalMainNode();
  }

  exportJSON() {
    return {
      type: 'parentheticalMain',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default ParentheticalMainNode;
