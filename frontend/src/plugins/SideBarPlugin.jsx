import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $createParagraphNode,
  $getSelection,
  $insertNodes,
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,
  KEY_DOWN_COMMAND,
  createCommand,
} from 'lexical';
import { $setBlocksType } from '@lexical/selection';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { useLayoutEffect, useState } from 'react';
import { Box, Button, Divider, Menu, MenuItem, Stack, Typography, useTheme } from '@mui/material';
import { $findMatchingParent } from '@lexical/utils';

import SceneNode, { $createSceneNode } from '@/nodes/SceneNode';
import SubHeaderNode, { $createSubHeaderNode } from '@/nodes/SubHeaderNode';
import SluglineNode, { $createSluglineNode } from '@/nodes/SluglineNode';
import ActionNode, {
  $createActionNode,
  $isActionNode,
} from '@/nodes/ActionNode';
import {
  $createDialogueContainerNode,
  $isDialogueContainerNode,
} from '@/nodes/DialogueContainerNode';
import TransitionNode, { $createTransitionNode } from '@/nodes/TransitionNode';
import { $createDialogueNode, $isDialogueNode } from '@/nodes/DialogueNode';
import {
  $createParentheticalNode,
  $isParentheticalNode,
} from '@/nodes/ParentheticalNode';
import { $createCutbackNode } from '@/nodes/CutBackNode';
import { $createFlashcutNode } from '@/nodes/FlashCutNode';
import { $createIntercutNode } from '@/nodes/InterCutNode';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { $createParentheticalMainNode } from '@/nodes/ParanthticalMain';

export const INSERT_CONTENT_COMMAND = createCommand('insert-content');

const SideBarPlugin = () => {
  const { palette } = useTheme();
  const [editor] = useLexicalComposerContext();

  const insertContentAction = (payload) => {
    // return if payload is undefined or null
    if (payload === undefined || payload === null) {
      console.error(`payload for INSERT_CONTENT_COMMAND is ${typeof payload}`);
      return true;
    }

    const insertContent = {
      scene: () => handleNodeInsert(SceneNode, $createSceneNode),
      subheader: () => handleNodeInsert(SubHeaderNode, $createSubHeaderNode),
      slugline: () => handleNodeInsert(SluglineNode, $createSluglineNode),
      action: () => handleNodeInsert(ActionNode, $createActionNode),
      transition: () => handleNodeInsert(TransitionNode, $createTransitionNode),

      dialogue: () => {
        const nodes = selection.getNodes();
        let DContainer;
        let Parenthetical;
        let Dialogue;

        for (const node of nodes) {
          let matchingParent = findDialogueContainerParent(node);
          if (matchingParent) {
            DContainer = matchingParent;
            break;
          }
        }

        if (DContainer) {
          const dialogue = DContainer.getChildren().find((node) =>
            $isDialogueNode(node),
          );
          if (dialogue) {
            const newContainer = $createDialogueContainerNode();
            const newDia = $createDialogueNode();
            const newPare = $createParentheticalNode();
            DContainer.insertAfter(newContainer.append(newPare, newDia));
            return newPare.select();
          }
          const pare = $findMatchingParent(
            selection.anchor.getNode(),
            (parent) => $isParentheticalNode(parent),
          );
          if (pare) {
            const newDia = $createDialogueNode();
            pare.insertAfter(newDia);
            return newDia.select();
          }
        } else {
          DContainer = $createDialogueContainerNode();
          Parenthetical = $createParentheticalNode();
          Dialogue = $createDialogueNode();
          DContainer.append(Parenthetical, Dialogue);
          $insertNodes([DContainer]);
          return Parenthetical.select();
        }
      },

      parenthetical: () => {
        const newParentheticalMain = $createParentheticalMainNode();
      
        $insertNodes([newParentheticalMain]);
        
        return newParentheticalMain.select();
      },

      flashcut: () => {
        const newFlashcut = $createFlashcutNode();

        $insertNodes([newFlashcut]);

        return newFlashcut.select();
      },

      cutback: () => {
        const newCutback = $createCutbackNode();

        $insertNodes([newCutback]);

        return newCutback.select();
      },

      intercut: () => {
        const newIntercut = $createIntercutNode();

        $insertNodes([newIntercut]);

        return newIntercut.select();
      },

    };

    function handleNodeInsert(nodeToInsert, createNodeToInsert) {
      const nodesInSelection = selection.getNodes();
      const singleNode =
        nodesInSelection.length === 1 ? nodesInSelection[0] : null;
      const singleNodeParent = singleNode?.getParent();
      const dialogueContainerParent = singleNode
        ? findDialogueContainerParent(singleNode)
        : null;

      if (selection.isCollapsed() && !dialogueContainerParent) {
        if (selection.anchor.getNode().__type === 'text') {
          return $insertNodes([createNodeToInsert()]);
        }

        /** set paragraph blocktype if the current selection contains ActionNode */
        if (
          ($isActionNode(singleNodeParent) ||
            nodesInSelection.some((node) => $isActionNode(node))) &&
          isSameType(ActionNode, nodeToInsert)
        ) {
          return $setBlocksType(selection, $createParagraphNode);
        }

        /** set action blocktype if the current selection node is the same as the node to insert */
        if (
          nodesInSelection.some(
            (node) =>
              node.__type === nodeToInsert?.getType() ||
              singleNodeParent.__type === nodeToInsert.getType(),
          )
        ) {
          return $setBlocksType(selection, $createActionNode);
        }
        return $setBlocksType(selection, createNodeToInsert);
      }

      /** inserts new node after container if the container is DialogueContainerNode */
      if (singleNode) {
        if (dialogueContainerParent) {
          const newNode = createNodeToInsert();
          dialogueContainerParent.insertAfter(newNode);
          return newNode.select();
        }
      }

      return $setBlocksType(selection, createNodeToInsert);
    }

    /** returns parent node that matches the  type. returns null if none is found */
    function findDialogueContainerParent(child) {
      return $findMatchingParent(child, (parent) =>
        $isDialogueContainerNode(parent),
      );
    }

    function isSameType(node1, node2) {
      return node1?.getType() === node2?.getType();
    }

    /** returns if the payload is invalid */
    if (insertContent[payload] === undefined) {
      console.error('invalid payload');
      return true;
    }

    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      insertContent[payload]();
    }

    return true;
  };

  useLayoutEffect(() => {
    const removeInsertContentListener = editor.registerCommand(
      INSERT_CONTENT_COMMAND,
      insertContentAction,
      COMMAND_PRIORITY_NORMAL,
    );

    const removeKeyDownListener = editor.registerCommand(
      KEY_DOWN_COMMAND,
      (event) => {
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

        if ((event.ctrlKey || (isMac && event.metaKey)) && event.altKey) {
          const payload = {
            KeyA: 'action',
            KeyS: 'slugline',
            KeyH: 'subheader',
            KeyN: 'scene',
            KeyT: 'transition',
            KeyD: 'dialogue',
            KeyF: 'flashcut',
            KeyC: 'cutback',
            KeyI: 'intercut'
          }[event.code];
          if (payload) {
            event.preventDefault();
            editor.dispatchCommand(INSERT_CONTENT_COMMAND, payload);
            return true;
          }
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL,
    );

    return () => {
      removeInsertContentListener();
      removeKeyDownListener();
    };
  }, [editor]);

  const handleClick = (payload) => {
    editor.dispatchCommand(INSERT_CONTENT_COMMAND, payload);
    setAnchorEl(null);

  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack gap="1rem" padding="1.5rem 1.45rem 0 1.5rem">
      <Divider
        component="span"
        sx={{
          color: palette.primary.lowContrastText,
          ':before': {
            borderTop: `thin dashed ${palette.primary.lowContrastText}`,
          },
          ':after': {
            borderTop: `thin dashed ${palette.primary.lowContrastText}`,
          },
        }}
      >
        Components
      </Divider>
      {/* <Button sx={{color:'white'}} onClick={()=>editor.dispatchCommand(INSERT_TABLE_COMMAND,{columns:3,rows:3,includeHeaders:true})}>INSERT Table</Button> */}
      {[
        ['Scene'],
        ['Sub', 'Header'],
        ['Slugline'],
        ['Action'],
        ['Dialogue'],
        ['Parenthetical'],
        // ['Transition'],
        // ['Flashcut'],
        // ['Cutback'],
        // ['Intercut']
      ].map((node) => {
        const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);
        const combo = {
          scene: isMac ? 'Cmd + Alt + N' : 'Ctrl + Alt + N',
          subheader: isMac ? 'Cmd + Alt + H' : 'Ctrl + Alt + H',
          slugline: isMac ? 'Cmd + Alt + S' : 'Ctrl + Alt + S',
          action: isMac ? 'Cmd + Alt + A' : 'Ctrl + Alt + A',
          dialogue: isMac ? 'Cmd + Alt + D' : 'Ctrl + Alt + D',
          parenthetical: isMac ? 'Cmd + Alt + P' : 'Ctrl + Alt + P',
          transition: isMac ? 'Cmd + Alt + T' : 'Ctrl + Alt + T',
          flashcut: isMac ? 'Cmd + Alt + F' : 'Ctrl + Alt + F',
          cutback: isMac ? 'Cmd + Alt + C' : 'Ctrl + Alt + C',
          intercut: isMac ? 'Cmd + Alt + I' : 'Ctrl + Alt + I'
        };

        return (
          <Button
            key={node.join('')}
            onClick={() => handleClick(node.join('').toLowerCase())}
            variant="contained"
            sx={{
              color: palette.primary.lowContrastText,
              display: 'block',
              padding: '0.7rem 0.8rem',
              textAlign: 'start',
              border: '1px solid #ffffff1f',
              borderImageSlice: 1,
              borderRadius: '0.38rem',
              boxShadow: '2px 2px 6px 0px rgba(0, 0, 0, 0.37)',
            }}
          >
            <Typography component="span" fontSize="0.75rem" fontWeight="200">
              ({combo[node.join('').toLocaleLowerCase()]})
            </Typography>
            <Typography
              component="span"
              sx={{ display: 'block' }}
              fontSize="1.125rem"
              fontWeight="500"
            >
              {node.join(' ')}
            </Typography>
          </Button>
        );
      })}

      <Button
        variant="contained"
        onClick={handleMenuClick}
        sx={{
          color: palette.primary.lowContrastText,
          display: 'block',
          padding: '0.7rem 0.8rem',
          textAlign: 'start',
          border: '1px solid #ffffff1f',
          borderImageSlice: 1,
          borderRadius: '0.38rem',
          boxShadow: '2px 2px 6px 0px rgba(0, 0, 0, 0.37)',
        }}
      >
        <Typography
          component="span"
          sx={{ display: 'block' }}
          fontSize="1.125rem"
          fontWeight="500"
        >
          Transitions
        </Typography>
      </Button>

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem onClick={() => handleClick('flashcut')} sx={{ display: 'grid', width: '150px' }}>
          <Typography component="span" fontSize="0.75rem" fontWeight="200">
            Ctrl + Alt + F
          </Typography>
          <Typography>
            Flash Cut
          </Typography>
        </MenuItem>
        <Divider sx={{backgroundColor:'black'}}/>
        <MenuItem onClick={() => handleClick('transition')} sx={{ display: 'grid', width: '150px' }}>
          <Typography component="span" fontSize="0.75rem" fontWeight="200">
            Ctrl + Alt + T
          </Typography>
          <Typography>
            Cut to
          </Typography>
        </MenuItem>
        <Divider sx={{backgroundColor:'black'}}/>
        <MenuItem onClick={() => handleClick('cutback')} sx={{ display: 'grid', width: '150px' }}>
          <Typography component="span" fontSize="0.75rem" fontWeight="200">
            Ctrl + Alt + C
          </Typography>
          <Typography>
            Cut Back
          </Typography>
        </MenuItem>
        <Divider sx={{backgroundColor:'black'}}/>
        <MenuItem onClick={() => handleClick('intercut')} sx={{ display: 'grid', width: '150px' }}>
          <Typography component="span" fontSize="0.75rem" fontWeight="200">
            Ctrl + Alt + I
          </Typography>
          <Typography>
            Intercut
          </Typography>
        </MenuItem>
      </Menu>

    </Stack>
  );
};

export default SideBarPlugin;
