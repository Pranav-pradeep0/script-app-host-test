import {
  AppBar,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  useMediaQuery,
  useTheme,
  Button,
} from '@mui/material';
import {
  CaretLeft,
  Keyboard,
  List as ListIcon,
  CaretDown,
} from '@phosphor-icons/react';
import { useContext, useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { GradientBtn, InlineEditable } from '@common';
import { PRINT_COMMAND } from '@/plugins/PrintPlugin';
import { ScriptSocketContext } from '@/context/ScriptSocketContext';
import AddCharacterModal from '@script/addCharacterModal/AddCharacterModal';
import { setCharacters } from '@/store/slices/scriptSlice';
import { useTitle } from '@/context/OnelineTitleContext';

const ScriptHeader = () => {

  const { palette } = useTheme();
  const [editor] = useLexicalComposerContext();
  const { socket } = useContext(ScriptSocketContext);
  const { id } = useParams();
  const { title, characters } = useLoaderData();
  const dispatch = useDispatch();

  const [titleValue, setTitleValue] = useState(title);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 600px)');


  const { oneLineTitle, } = useTitle

  useEffect(() => {
    dispatch(setCharacters(characters || []));
  }, [characters]);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  // manage inline editable
  const onTitleBlur = () => {
    if (!id) {
      throw new Response('id not found', { status: 404 });
    }
    if (socket && socket.connected) {
      if (titleValue != '') {
        socket.emit('edit-title', { title: titleValue, id });
      }
    } else {
      console.error('socket connection not open');
    }
  };

  return (
    <>
      <AppBar
        sx={{
          background: palette.secondary.main,
          boxShadow: '0px 0px 17px 0px rgba(0, 0, 0, 0.10)',
        }}
      >
        <Toolbar sx={{ height: '4.5rem' }}>
          <Button
            sx={{
              fontSize: '1.125rem',
              fontWeight: 600,
              padding: '0 0.5rem 0 0',
              lineHeight: '1',
              flexShrink: 0,
              '& .MuiButton-startIcon': {
                margin: '0.12rem',
              },
            }}
            startIcon={<CaretLeft size="1.5rem" weight="thin" />}
          >
            <Link to={'/'} style={{ color: 'inherit', textDecoration: 'none' }}>Back to Home</Link>
          </Button>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            sx={{ display: { xs: 'none', md: 'flex' } }}
          >
            <Stack direction="row" gap="0.75rem" marginLeft="5rem">
              {/* <Button
                sx={{ backgroundColor: '#F2F2F2', height: 'fit-content' }}
              >
                Page Preferences
              </Button> */}
              {/* <Button
                sx={{
                  fontSize: 14,
                  backgroundColor: '#F2F2F2',
                  display: 'flex',
                  alignItems: 'center',
                  height: 'fit-content',
                  '& .MuiButton-endIcon': { marginLeft: '6px' },
                }}
                endIcon={<CaretDown size={12} />}
              >
                <span style={{ marginTop: '-0.125rem' }}>അ</span>{' '}
                <Keyboard size={14} weight="thin" />
              </Button> */}
              <Link to={`/document/${id}/index`}>
                <Button
                  sx={{ backgroundColor: '#F2F2F2', height: 'fit-content' }}
                >
                  One Line
                </Button>
              </Link>
              <AddCharacterModal socket={socket} id={id} />
            </Stack>
            <InlineEditable
              onBlur={onTitleBlur}
              onChange={(e) => setTitleValue(e.target.value)}
              value={titleValue}
            />
            <Stack direction="row" gap="0.94rem">
              {/* <GradientBtn size="large" sx={{ fontWeight: '600' }}>
                Save Template
              </GradientBtn> */}
              <GradientBtn
                size="large"
                sx={{
                  fontWeight: '600',
                  background: '#000',
                  color: '#fff',
                  ':hover': { background: '#000' },
                }}
                onClick={() => editor.dispatchCommand(PRINT_COMMAND)}
              >
                Download
              </GradientBtn>
            </Stack>
          </Stack>

          {isSmallScreen && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
            >
              <ListIcon size={32} weight="thin" />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isSmallScreen && isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <ul>
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </Drawer>
    </>
  );
};

export default ScriptHeader;
