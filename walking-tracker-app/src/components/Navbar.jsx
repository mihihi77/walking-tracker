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
import NotificationsIcon from '@mui/icons-material/Notifications'; // Import Notifications Icon
import { Badge } from '@mui/material';

const pages = ['About', 'Dashboard', 'Tracking'];
const settings = ['Profile', 'Logout'];

function Navbar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]); // Notifications state
  const [anchorElNoti, setAnchorElNoti] = React.useState(null); // Notifications menu anchor

  // Fetch notifications from localStorage on page load
  React.useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
    setNotifications(stored);
  }, []);

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

  const handleOpenNotiMenu = (event) => {
    setAnchorElNoti(event.currentTarget); // Open notifications menu
  };

  const handleCloseNotiMenu = () => {
    setAnchorElNoti(null); // Close notifications menu
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("justRegistered");
      sessionStorage.clear();
      navigate('/login');
    }).catch((error) => {
      console.error("Lỗi đăng xuất:", error);
    });
    handleCloseUserMenu();
  };

  const handleNavigation = (page) => {
    handleCloseNavMenu();
    handleCloseNotiMenu();
    navigate(`/${page.toLowerCase() === 'about' ? '' : page.toLowerCase()}`);
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#121212', top: 0, left: 0, right: 0, zIndex: 1300 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Left section with logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Mobile menu icon */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
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

            {/* Desktop & Mobile logo */}
            <DirectionsWalkIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#"
              sx={{
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.2rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              WalkMate
            </Typography>
          </Box>

          {/* Center section with navigation links (desktop only) */}
          <Box sx={{ 
            display: { xs: 'none', md: 'flex' }, 
            position: 'absolute', 
            left: '50%', 
            transform: 'translateX(-50%)',
            justifyContent: 'center'
          }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handleNavigation(page)}
                sx={{ color: 'white', mx: 1 }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Right section with avatar and notifications */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* Notifications Icon with margin spacing */}
            <Tooltip title="Notifications">
              <IconButton onClick={handleOpenNotiMenu} sx={{ p: 0, color: 'white', mr: 3 }}> {/* Added mr: 3 */}
                <Badge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* Notifications menu */}
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

            {/* Avatar menu */}
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
