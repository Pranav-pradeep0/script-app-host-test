import { $createParagraphNode, ElementNode } from 'lexical';

/**
 * Base class that is extended to create other element nodes which needs to replace the node with paragraphnode or
 * when user deletes all contents in the editor or when the node should be set to paragraphnode when exiting the current node(clicking Enter)
 */

export class DefaultParagraphNode extends ElementNode {
  // Node should be set to paragraph when user delete all content
  collapseAtStart(_) {
    const paragraph = $createParagraphNode();
    const children = this.getChildren();
    children.forEach((child) => paragraph.append(child));
    this.replace(paragraph);
    return true;
  }
  /**
   * Node should be set to paragraph when user press Enter.
   * Node will remain the same on Shift + Enter
   */
  insertNewAfter(_, restoreSelection) {
    const paragraph = $createParagraphNode();
    const direction = this.getDirection();
    paragraph.setDirection(direction);
    this.insertAfter(paragraph, restoreSelection);
    return paragraph;
  }
}

export default DefaultParagraphNode;
