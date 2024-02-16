import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical';
import { useEffect } from 'react';

export const GOTO_PAGE = createCommand();

export default function GotoPagePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes(['PageBreakNode'])) {
      console.warn('GotoPagePlugin: PageBreakNode is not registered on editor');
      return;
    }

    return mergeRegister(
      editor.registerCommand(
        GOTO_PAGE,
        (pageNumber) => {
          const parsedPageNumber = parseInt(pageNumber, 10);

          if (isNaN(parsedPageNumber) || parsedPageNumber <= 0) {
            console.warn('Invalid page number');
            return false;
          }

          const root = $getRoot();
          const pageBreakNodes = root.getChildren().filter((node) => node.type === 'PageBreakNode');

          if (parsedPageNumber <= pageBreakNodes.length) {
            const targetPageBreakNode = pageBreakNodes[parsedPageNumber - 1];
            const element = editor.getElementByKey(targetPageBreakNode.__key);

            if (element) {
              element.scrollTo();
            }
          } else {
            console.warn(`Page ${parsedPageNumber} does not exist.`);
          }

          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
}
