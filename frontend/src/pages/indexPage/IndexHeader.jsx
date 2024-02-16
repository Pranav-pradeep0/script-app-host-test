import { useTitle } from '@/context/OnelineTitleContext';
import { ScriptSocketContext } from '@/context/ScriptSocketContext';
import { PRINT_COMMAND } from '@/plugins/PrintPlugin';
import { GradientBtn, InlineEditable } from '@common';
import { AppBar, Box, Button, Drawer, IconButton, Stack, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import { CaretDown, CaretLeft, Keyboard, List as ListIcon } from '@phosphor-icons/react';
import AddCharacterModal from '@script/addCharacterModal/AddCharacterModal';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const IndexHeader = ({ onDownload, onTitleChange, titleValue, setTableModalOpen }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // const [titleValue, setTitleValue] = useState('untited');
    const { palette } = useTheme();
    const isSmallScreen = useMediaQuery('(max-width: 600px)');
    const { id } = useParams();

    const { socket } = useContext(ScriptSocketContext);

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
    }

    const { oneLineTitle, setTitleName } = useTitle()

    // const onInputChange = (e) => {
    //     const oneLineTitle = e.target.value
    //     setTitleValue(oneLineTitle)
    //     setTitleName(oneLineTitle)
    // }

    const onInputChange = (e) => {
        const newTitle = e.target.value;
        onTitleChange(newTitle);
    };

    useEffect(() => {
        // console.log(oneLineTitle);
    }, [])

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
                        <Link to={'/'} style={{
                            textDecoration: 'none', color: 'inherit'
                        }}>Back to Home</Link>
                    </Button>
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        width="100%"
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        <Stack direction="row" gap="0.75rem" marginLeft="5rem">
                            <Link to={`/document/${id}`}>
                                <Button
                                    sx={{ backgroundColor: '#F2F2F2', height: 'fit-content' }}
                                >
                                    Go to Script
                                </Button>
                            </Link>
                            <Button sx={{padding:0, margin:0}}><AddCharacterModal socket={socket} id={id} /></Button>
                        </Stack>
                        <InlineEditable
                            onBlur={onTitleBlur}
                            onChange={onInputChange}
                            value={titleValue}
                        />
                        <Stack direction="row" gap="0.94rem">
                            <GradientBtn
                                size="large"
                                sx={{
                                    fontWeight: '600',
                                    background: '#000',
                                    color: '#fff',
                                    ':hover': { background: '#000' },
                                }}
                                onClick={() => setTableModalOpen(true)}
                            >
                                Save Preview
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
    )
}

export default IndexHeader;