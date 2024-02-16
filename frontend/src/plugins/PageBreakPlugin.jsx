import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $createParagraphNode,
  $getPreviousSelection,
  $getRoot,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  $splitNode,
  COMMAND_PRIORITY_EDITOR,
  DEPRECATED_$isGridSelection,
  createCommand,
} from 'lexical';
import { useEffect } from 'react';

import {
  $createPageBreakNode,
  $isPageBreakNode,
  PageBreakNode,
} from '@/nodes/PageBreakNode';
import { $isDialogueContainerNode } from '@/nodes/DialogueContainerNode';

export const INSERT_PAGE_BREAK = createCommand();

export default function PageBreakPlugin() {

  const EXTRA_PAGE_HEIGHT = 938;

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PageBreakNode]))
      throw new Error(
        'PageBreakPlugin: PageBreakNode is not registered on editor',
      );

    if (!editor.hasNodes([PageBreakNode])) {
      console.warn('PageBreakPlugin: PageBreakNode is not registered on editor');
      return;
    }

    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const filtered = root
            .getChildren()
            .filter((node) => $isPageBreakNode(node));
          filtered.forEach((node, index) => {
            editor
              .getElementByKey(node.__key)
              .setAttribute(
                'count',
                // `page ${index + 1}/${filtered.length + 1}`,
                `page ${index + 1}/${filtered.length}`,
              );
          });
        });
      }),

      editor.registerCommand(
        INSERT_PAGE_BREAK,
        () => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) return false;

          const focusNode = selection.focus.getNode();
          if (focusNode !== null) {
            const pgBreak = $createPageBreakNode();
            $insertNodeToNearestRoot(pgBreak);
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
}

function $insertNodeToNearestRoot(node) {
  const selection = $getSelection() || $getPreviousSelection();

  if ($isRangeSelection(selection)) {
    const { focus } = selection;
    const focusNode = focus.getNode();
    const focusOffset = focus.offset;
    const DContainerParent = $findMatchingParent(focusNode, (parent) =>
      $isDialogueContainerNode(parent),
    );
    if (DContainerParent) {
      DContainerParent.insertAfter(node);
      const paragraphNode = $createParagraphNode();
      node.insertAfter(paragraphNode);
      node.selectNext();
    } else if ($isRootOrShadowRoot(focusNode)) {
      const focusChild = focusNode.getChildAtIndex(focusOffset);
      if (focusChild == null) {
        focusNode.append(node);
      } else {
        focusChild.insertBefore(node);
      }
      node.selectNext();
    } else {
      let splitNode;
      let splitOffset;
      if ($isTextNode(focusNode)) {
        splitNode = focusNode.getParentOrThrow();
        splitOffset = focusNode.getIndexWithinParent();

        if (focusOffset > 0) {
          splitOffset += 1;
          focusNode.splitText(focusOffset);
        }
      } else {
        splitNode = focusNode;
        splitOffset = focusOffset;
      }
      const [, rightTree] = $splitNode(splitNode, splitOffset);
      rightTree.insertBefore(node);
      rightTree.selectStart();
    }
  }
  else {
    if ($isNodeSelection(selection) || DEPRECATED_$isGridSelection(selection)) {
      const nodes = selection.getNodes();
      nodes[nodes.length - 1].getTopLevelElementOrThrow().insertAfter(node);
    } else {
      const root = $getRoot();
      root.append(node);
    }
    const paragraphNode = $createParagraphNode();
    node.insertAfter(paragraphNode);
    paragraphNode.select();
  }
  return node.getLatest();
}
