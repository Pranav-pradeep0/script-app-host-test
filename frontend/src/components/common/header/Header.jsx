import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import full_logo_image from '@assets/images/logoBlack.svg';
import { Avatar, Badge, Menu, MenuItem, Tooltip } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Bell } from '@phosphor-icons/react';
import { Link, useNavigate } from 'react-router-dom';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'black',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '40ch',
      },
    },
  },
}));

export default function Header() {

  const currentUser = localStorage.getItem('userName')

  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogOut = () => {
    localStorage.clear()
    navigate('/login')
  }

  const userId = localStorage.getItem("userId");

  return (
    <Box sx={{ flexGrow: 1, }}>
      <AppBar position="static" sx={{ backgroundColor: 'white' }} >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            width="10%"
            component="img"
            src={full_logo_image}
          />
          <Box sx={{ marginInline: 'auto' }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>
          </Box>
          <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'center', alignItems: 'center' }}>
            <Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <Box sx={{ backgroundColor: '#313131', paddingInline: '20px', paddingBlock: '5px', borderRadius: '5px' }}>
                    <Box onClick={handleOpenUserMenu} sx={{ p: 0, display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'center' }}>
                      <Avatar sx={{ width: 28, height: 28 }} alt="" src="" />
                      <Typography sx={{ fontFamily: 'inherit', fontWeight: '600' }}>
                        {currentUser ? currentUser : 'User'}
                      </Typography>
                      <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                    </Box>
                  </Box>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px', }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleLogOut} sx={{ width: '150px', }}>
                    <Typography textAlign="center" sx={{ marginInline: 'auto' }}>Logout</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    handleLogOut
                    navigate(`/profile/${userId}`)
                  }}
                    sx={{ width: '150px', }}>
                    <Typography textAlign="center" sx={{ marginInline: 'auto', }}>Profile</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
            <Box>
              <IconButton
                size="large"
                aria-label="show 17 new notifications"
                color="inherit"
              >
                <Badge color="error">
                  <Bell color="black" size={'30px'} />
                </Badge>
              </IconButton>
            </Box>
          </Box>
        </Toolbar >
      </AppBar >
    </Box >
  );
}