  import { ElementNode } from 'lexical';

  export const $createDialogueNode = () => new DialogueNode();
  export const $isDialogueNode = (node) => node instanceof DialogueNode;

  export class DialogueNode extends ElementNode {
    constructor() {
      super();
    }

    createDOM(_config, _editor) {
      const div = document.createElement('div');
      div.className = _config.theme.dialogue;
      div.setAttribute('data-placeholder', 'Dialogue...');
      return div;
    }

    updateDOM() {
      return false;
    }

    static clone(node) {
      return new DialogueNode(node.__key);
    }
    static getType() {
      return 'dialogue';
    }

    static importJSON(_) {
      return new DialogueNode();
    }

    isParentRequired() {
      return true;
    }
    
    insertNewAfter() {
      const parent = this.getParent();
      if (!parent) {
        // The DialogueContainerNode does not have a parent node, so we cannot insert a new node after it.
        return;
      }
      // Insert a new node after the DialogueContainerNode.
      const newlyInserted = parent.insertNewAfter();
      newlyInserted.select();
      return newlyInserted;
    }

    collapseAtStart() {
      return this.remove();
    }

    exportJSON() {
      return {
        type: 'dialogue',
        version: 1,
        children: [],
        format: '',
        indent: 1,
        direction: null,
      };
    }
  }

  export default DialogueNode;