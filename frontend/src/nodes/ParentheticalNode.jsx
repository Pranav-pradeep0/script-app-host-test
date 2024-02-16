import { ElementNode } from 'lexical';
import { $createDialogueNode, $isDialogueNode } from './DialogueNode';
import { $createMentionNode } from './MentionNode';
import { $isDialogueContainerNode } from './DialogueContainerNode';

export const $createParentheticalNode = () => new ParentheticalNode();
export const $isParentheticalNode = (node) => node instanceof ParentheticalNode;

export class ParentheticalNode extends ElementNode {
  constructor() {
    super();
  }

  createDOM(config) {
    const div = document.createElement('div');
    const placeholder = this.isDialogueParent() ? 'Enter character' : 'Enter parenthetical...';

    div.className = this.isDialogueParent() ? config.theme.parenthetical : config.theme.dialogue;
    div.setAttribute('data-placeholder', placeholder);

    // if (!this.isDialogueParent()) {
    //   div.style.fontStyle = 'italic';
    // }
    
    return div;
  }

  updateDOM() {
    return false;
  }

  static clone(node) {
    return new ParentheticalNode(node.__key);
  }

  static getType() {
    return 'parenthetical';
  }

  static importJSON() {
    return new ParentheticalNode();
  }

  isParentRequired() {
    return true;
  }

  isDialogueParent() {
    const dialogueContainer = this.getParent();
    return dialogueContainer && $isDialogueContainerNode(dialogueContainer);
  }

  insertNewAfter(_, restoreSelection) {
    if (!$isDialogueNode(this.getNextSibling())) {
      const dialogue = $createDialogueNode();
      this.insertAfter(dialogue, restoreSelection);
      return dialogue;
    }
    return this.selectNext();
  }

  remove(preserveEmptyParent) {
    if (this.getNextSibling()) this.selectNext();
    return super.remove(preserveEmptyParent);
  }

  collapseAtStart() {
    return this.remove();
  }

  exportJSON() {
    return {
      type: 'parenthetical',
      version: 1,
      children: [],
      format: '',
      indent: 1,
      direction: null,
    };
  }
}

export default ParentheticalNode;
