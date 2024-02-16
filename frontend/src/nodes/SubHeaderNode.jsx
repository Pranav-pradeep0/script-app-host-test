import { $applyNodeReplacement } from 'lexical';

import DefaultActionNode from './DefaultActionNode';
import DefaultParagraphNode from './DefaultParagraphNode';

export const $createSubHeaderNode = () =>
  $applyNodeReplacement(new SubHeaderNode());
export const $isSubHeaderNode = (node) => node instanceof SubHeaderNode;

export class SubHeaderNode extends DefaultParagraphNode {
  constructor() {
    super();
  }

  createDOM(config) {
    const h5 = document.createElement('h5');
    h5.className = config.theme.subheader;
    h5.setAttribute('data-placeholder', 'Subheader...');

    return h5;
  }
  updateDOM() {
    return false;
  }

  static clone(node) {
    return new SubHeaderNode(node.__key);
  }
  static getType() {
    return 'subheader';
  }

  static importJSON() {
    return new SubHeaderNode();
  }
  exportJSON() {
    return {
      type: 'subheader',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default SubHeaderNode;
