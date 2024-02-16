import {
  Button,
  Divider,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  SELECT_ALL_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import { mergeRegister } from '@lexical/utils';
import { useCallback, useEffect, useState } from 'react';
import {
  CaretDown,
  Plus,
  Minus,
  HighlighterCircle,
  TextAlignLeft,
  ListBullets,
  ListNumbers,
  AlignLeft,
  Article,
  Image as ImageIcon,
  Link as LinkIcon,
  ArrowUUpLeft,
  ArrowUUpRight,
  ArrowsOut,
  Binoculars,
  MagnifyingGlass,
  Scissors,
} from '@phosphor-icons/react';

import { INSERT_PAGE_BREAK } from './PageBreakPlugin';
import { INSERT_CONTENT_COMMAND } from './SideBarPlugin';
import styled from 'styled-components';
import { useZoom } from '@/context/ZoomContext';
import { usePageNumber } from '@/context/PageNumberContext';

const LowPriority = 1;

const CustomTextActions = () => {

  const [editor] = useLexicalComposerContext();

  const [canUndo, setCanUndo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  const handleClick = (formatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };
  
  return (
    <Stack direction="row">
      {[
        ['B', 'bold'],
        ['I', 'italic'],
        ['U', 'underline'],
        ['A', ''],
        ['pen', ''],
      ].map((value) => {
        return (
          <IconButton
            key={value}
            onClick={() => handleClick(value[1])}
            sx={{ color: 'white' }}
          >
            {value[0] === 'pen' ? (
              <HighlighterCircle size="1rem" />
            ) : (
              <Typography
                fontSize="0.875rem"
                fontWeight={isBold && value[0] === 'B' ? 'bold' : '200'}
                fontStyle={isItalic && value[0] === 'I' ? 'italic' : 'normal'}
                sx={{
                  textDecoration:
                    isUnderline && value[0] === 'U' ? 'underline' : null,
                }}
              >
                {value[0]}
              </Typography>
            )}
          </IconButton>
        );
      })}
    </Stack>
  );
};

const ToolbarPlugin = ({ setSearchText }) => {
  const { palette } = useTheme();
  const [editor] = useLexicalComposerContext();
  const [fontSize, setFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState('Roboto');
  const availableFonts = ['Roboto', 'Arial', 'Times New Roman', 'Verdana'];
  // const [searchTerm, setSearchText] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { pageNumber, setPageNum } = usePageNumber()
  const [gotoPage, setGotoPage] = useState()

  const { zoomLevel, enableScreenEnlarge, handleZoomIn, handleZoomOut, hideSidebars, zoomValue } = useZoom();

  const setPageToGo = (e) => {
    let pageNum = e.target.value
    setGotoPage(pageNum)
  }

  const handleFontSizeChange = (amount) => {
    const newFontSize = fontSize + amount;
    setFontSize(newFontSize);
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, { fontSize: `${newFontSize}px` });
    // editor.dispatchCommand(UNDO_COMMAND)
    };

  const handleFontFamilyChange = (event) => {
    const newFontFamily = event.target.value;
    setFontFamily(newFontFamily);
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, { fontFamily: newFontFamily });
  };

  const handleSearchTermChange = (e) => {
    const serchText = e.target.value
    setSearchText(serchText)
  }

  const fullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const enterFullscreen = () => {
    hideSidebars(false);
    enableScreenEnlarge(120);
    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    hideSidebars(true);
    enableScreenEnlarge(100);
    setIsFullscreen(false);
  };

  const undo = () => {
    // document.execCommand('undo', false, null);
    editor.dispatchCommand(UNDO_COMMAND)
  }

  const redo = () => {
    // document.execCommand('redo', false, null);
    editor.dispatchCommand(REDO_COMMAND)
  }

  // const isZoomed = zoomLevel > 110;

  const testFunctions = () => {
    editor.dispatchCommand(SELECT_ALL_COMMAND)
  }


  useEffect(() => {
    setGotoPage(pageNumber)
  }, [pageNumber])

  return (
    <Stack
      height="5.125rem"
      width='100%'
      marginInline='auto'
      bgcolor={palette.secondary.main}
      sx={{
        position: 'sticky', zIndex: 1,
        // opacity: isZoomed ? 0.3 : 1
      }}
      top="5px"
    >
      <Stack
        direction="row"
        height="50%"
        width="100%"
        bgcolor={palette.primary.main}
        sx={{ borderTopRightRadius: '0.25rem', borderTopLeftRadius: '0.25rem' }}
        justifyContent={'space-around'}
        divider={
          <Divider
            orientation="vertical"
            sx={{ borderLeft: `1px solid rgba(255,255,255,0.10)` }}
          />
        }
      >
        <Select
          value={fontFamily}
          onChange={handleFontFamilyChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Font Family' }}
          sx={{
            color: 'white',
            fontWeight: '400',
            border: "none",
            outline: 'none',
            boxShadow: 'none',
            '& .MuiSelect-icon': { color: 'white' },
          }}
        >
          {availableFonts.map((font) => (
            <MenuItem key={font} value={font}>
              {font}
            </MenuItem>
          ))}
        </Select>
        <Button
          sx={{
            color: 'white',
            fontWeight: '400',
          }}
          endIcon={<Plus onClick={() => handleFontSizeChange(1)} size="12px" />}
          startIcon={<Minus onClick={() => handleFontSizeChange(-1)} size="12px" />}
        >
          {fontSize}px
        </Button>
        <CustomTextActions />
        <Stack direction="row">
          {[
            { key: 'ltr', icon: <TextAlignLeft size="1rem" /> },
            { key: 'ul', icon: <ListBullets size="1rem" /> },
            { key: 'ol', icon: <ListNumbers size="1rem" /> },
            { key: 'left', icon: <AlignLeft size="1rem" /> },
            { key: 'artcl', icon: <Article size="1rem" /> },
          ].map((value) => {
            return (
              <IconButton key={value['key']} sx={{ color: 'white' }}>
                {value['icon']}
              </IconButton>
            );
          })}
        </Stack>
        <Stack direction="row">
          {[
            { key: 'img', icon: <ImageIcon size="1rem" /> },
            { key: 'lnk', icon: <LinkIcon size="1rem" /> },
          ].map((value) => {
            return (
              <IconButton key={value['key']} sx={{ color: 'white' }}>
                {value['icon']}
              </IconButton>
            );
          })}
        </Stack>
      </Stack>
      <Stack
        direction={'row'}
        height="50%"
        width="100%"
        bgcolor="rgba(36, 36, 36, 0.80)"
        alignItems="center"
        sx={{
          borderBottomRightRadius: '0.25rem',
          borderBottomLeftRadius: '0.25rem',
        }}
        divider={
          <Divider
            orientation="vertical"
            sx={{ borderLeft: `1px solid rgba(255,255,255,0.10)` }}
          />
        }
      >
        <Stack direction="row" gap="1.9rem">
          <IconButton sx={{ color: 'white' }} onClick={undo} >
            <ArrowUUpLeft size="1rem" />
          </IconButton>
          <IconButton
            onClick={redo}
            sx={{
              color: 'white',
              ':disabled': { color: 'white', opacity: '0.5' },
            }}
          >
            <ArrowUUpRight size="1rem" />
          </IconButton>
        </Stack>
        <Stack
          direction="row"
          flexGrow={1}
          justifyContent="space-between"
          px="1rem"
        >
          <Stack direction="row" gap="1.5rem">
            <IconButton onClick={fullscreen} sx={{ color: 'white' }}>
              <ArrowsOut size="1rem" />
            </IconButton>

            <IconButton sx={{ color: 'white' }} onClick={testFunctions}>
              <Binoculars size="1rem"/>
            </IconButton>

          </Stack>
          <Stack direction="row" alignItems="center">
            <Typography fontSize="0.75rem" color="white">
              Page
            </Typography>
            <input
              type="text"
              value={gotoPage}
              onChange={setPageToGo}
              style={{
                width: '2.25rem',
                textAlign: 'center',
                height: '1.13rem',
                marginLeft: '0.5rem',
                borderRadius: '0.81rem',
                border: 'none',
                outline: 'none',
                color: 'black !important',
                backgroundColor: '#D9D9D9 !important',
              }}
            />
            <Typography
              fontSize="0.75rem"
              color="white"
              sx={{ marginLeft: '0.2rem' }}
            >
              / {pageNumber}
            </Typography>
          </Stack>
          <Stack direction="row" alignItems="center" gap="0.8rem">

          <Button
              sx={{
                color: 'white',
                fontWeight: '400',
                fontSize: '0.6rem',
              }}
              endIcon={<Plus onClick={handleZoomIn} size="12px" />}
              startIcon={<Minus onClick={handleZoomOut} size="12px" />}
            >
              {zoomLevel}%
            </Button>

            <Paper
              component="form"
              sx={{ p: '2px 4px', display: 'flex', backgroundColor: '#D9D9D9', alignItems: 'center', borderRadius: '10px', height: '1.5rem' }}
            >
              <InputBase
                // value={searchTerm}
                onChange={handleSearchTermChange}
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search by word"
                inputProps={{ 'aria-label': 'search google maps' }}
              />
              <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                <MagnifyingGlass size="1rem" />
              </IconButton>
            </Paper>


            <IconButton
              onClick={() =>
                editor.dispatchCommand(INSERT_PAGE_BREAK, undefined)
              }
            >
              <Scissors color="white" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default ToolbarPlugin;
