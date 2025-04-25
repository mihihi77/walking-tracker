import { Link, useNavigate } from 'react-router-dom';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Badge } from '@mui/material';

const pages = ['About', 'Dashboard', 'Tracking', 'Notifications'];
const settings = ['Profile', 'Logout'];

function Navbar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]); // Số lượng thông báo
  const [anchorElNoti, setAnchorElNoti] = React.useState(null); // Thông báo

  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(stored)
  }, []);

  const handleOpenNotiMenu = (event) => {
    setAnchorElNoti(event.currentTarget);
  };

  const handleCloseNotiMenu = () => {
    setAnchorElNoti(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    navigate('/login');
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#121212', top: 0, left: 0, right: 0, zIndex: 1300 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop icon + title */}
          <DirectionsWalkIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            WalkMate
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton size="large" onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    navigate(`/${page.toLowerCase() === 'about' ? '' : page.toLowerCase()}`);
                    handleCloseNavMenu();
                  }}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Mobile icon + title */}
          <DirectionsWalkIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            WalkMate
          </Typography>

          {/* Desktop menu items */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => {
                  navigate(`/${page.toLowerCase() === 'about' ? '' : page.toLowerCase()}`);
                  handleCloseNavMenu();
                }}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>
          {/* Notifications */}
          <Box sx={{ flexGrow: 0, mr: 2 }}>
            <Tooltip title="Notifications">
              <IconButton onClick={handleOpenNotiMenu} sx={{ p: 0, color: 'white' }}>
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElNoti}
              open={Boolean(anchorElNoti)}
              onClose={handleCloseNotiMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{ mt: '45px' }}
            >
              <MenuItem disabled><Typography textAlign="center">Recent Notifications</Typography></MenuItem>
              {notifications.length === 0 ? (
                <MenuItem><Typography textAlign="center">No activities yet. Start your first attempt! 🏃‍♂️</Typography></MenuItem>
              ) : (
                notifications.map((n, i) => (
                  <MenuItem key={i}>
                    <Box>
                      <Typography fontWeight="bold">{n.title}</Typography>
                      <Typography variant="body2">{n.body}</Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>
          </Box>

          {/* Avatar menu */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="https://i.pravatar.cc/300" />
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              sx={{ mt: '45px' }}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  {setting === 'Profile' ? (
                    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                    <Typography textAlign="center">{setting}</Typography>
                    </Link>
                  ) : (
                    <Typography textAlign="center" onClick={handleLogout}>{setting}</Typography>
                  )}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;