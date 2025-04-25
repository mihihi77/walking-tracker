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
import { auth } from '../firebase'; // Đảm bảo đường dẫn này đúng

const pages = ['About', 'Dashboard', 'Tracking'];
const settings = ['Profile', 'Logout'];

function Navbar() {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

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

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem("userLoggedIn");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("justRegistered");
      sessionStorage.clear();
      navigate('/login');
    }).catch((error) => {
      console.error("Lỗi đăng xuất:", error);
      // Xử lý lỗi đăng xuất nếu cần
    });
    handleCloseUserMenu();
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
                onClick={() => {
                  navigate(`/${page.toLowerCase() === 'about' ? '' : page.toLowerCase()}`);
                  handleCloseNavMenu();
                }}
                sx={{ color: 'white', mx: 1 }}
              >
                {page}
              </Button>
            ))}
          </Box>

          {/* Right section with avatar */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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