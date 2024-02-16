import DefaultActionNode from './DefaultActionNode';
import DefaultParagraphNode from './DefaultParagraphNode';

export const $createDialogueContainerNode = () => new DialogueContainerNode();

export const $isDialogueContainerNode = (node) =>
  node instanceof DialogueContainerNode;

export class DialogueContainerNode extends DefaultParagraphNode {
  constructor() {
    super();
  }

  createDOM(_config, _editor) {
    const div = document.createElement('div');
    div.className = _config.theme.dialogueContainer;
    return div;
  }
  updateDOM() {
    return false;
  }

  static clone(node) {
    return new DialogueContainerNode(node.__key);
  }
  static getType() {
    return 'dialogue-container';
  }
  canBeEmpty() {
    return false;
  }

  static importJSON(_) {
    return new DialogueContainerNode();
  }

  exportJSON() {
    return {
      type: 'dialogue-container',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default DialogueContainerNode;
