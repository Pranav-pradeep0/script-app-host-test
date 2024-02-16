import { $applyNodeReplacement } from 'lexical';

import DefaultActionNode from './DefaultActionNode';
import DefaultParagraphNode from './DefaultParagraphNode';

export const $createTransitionNode = () =>
  $applyNodeReplacement(new TransitionNode());

export const $isTransitionNode = (node) => node instanceof TransitionNode;

export class TransitionNode extends DefaultParagraphNode {
  constructor() {
    super();
  }
  createDOM(config) {
    const p = document.createElement('p');
    p.className = config.theme.transition;
    p.setAttribute('data-placeholder', 'Transition...');
    p.append(document.createTextNode('cut to'));
    return p;
  }
  updateDOM() {
    return false;
  }

  static clone(node) {
    return new TransitionNode(node.__key);
  }
  static getType() {
    return 'transition';
  }

  static importJSON() {
    return new TransitionNode();
  }

  exportJSON() {
    return {
      type: 'transition',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default TransitionNode;
