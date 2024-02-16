import { $applyNodeReplacement } from 'lexical';

import DefaultActionNode from './DefaultActionNode';
import DefaultParagraphNode from './DefaultParagraphNode';

export const $createSluglineNode = () =>
  $applyNodeReplacement(new SluglineNode());

export const $isSluglineNode = (node) => node instanceof SluglineNode;

export class SluglineNode extends DefaultParagraphNode {
  constructor() {
    super();
  }

  createDOM(config) {
    const h6 = document.createElement('h6');
    h6.className = config.theme.slugline;
    h6.setAttribute('data-placeholder', 'Slugline...');

    return h6;
  }
  updateDOM() {
    return false;
  }
  static clone(node) {
    return new SluglineNode(node.__key);
  }
  static getType() {
    return 'slugline';
  }

  static importJSON() {
    return new SluglineNode();
  }

  exportJSON() {
    return {
      type: 'slugline',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default SluglineNode;
