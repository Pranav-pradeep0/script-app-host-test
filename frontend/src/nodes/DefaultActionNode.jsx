import { ElementNode } from 'lexical';

import { $createActionNode } from './ActionNode';

/**
 * Base class that is extended to create other element nodes which needs to replace the node with actionNode or
 * when user deletes all contents in the editor or when the node should be set to actionNode when exiting the current node(clicking Enter)
 */

export class DefaultActionNode extends ElementNode {
  // Node should be set to action node when user delete all content
  collapseAtStart(_) {
    const Action = $createActionNode();
    const children = this.getChildren();
    children.forEach((child) => Action.append(child));
    this.replace(Action);
    return true;
  }

  /**
   * Node should be set to action node when user press Enter.
   * Node will remain the same on Shift + Enter
   */
  insertNewAfter(_, restoreSelection) {
    const Action = $createActionNode();
    const direction = this.getDirection();
    Action.setDirection(direction);
    this.insertAfter(Action, restoreSelection);
    return Action;
  }
}

export default DefaultActionNode;
