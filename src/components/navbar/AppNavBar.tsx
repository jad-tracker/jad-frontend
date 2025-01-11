import {AppBar, Avatar, Button, Menu, MenuItem, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import BugReportIcon from '@mui/icons-material/BugReport';
import useAuth from "../../hooks/auth/useAuth";
import React, {useCallback, useState} from "react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";

interface AppNavBarProps {
  disableLogout?: boolean;
}

export default function AppNavBar({disableLogout = false}: AppNavBarProps) {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const {username, logout} = useAuth();
  const navigate = useNavigate();

  console.log(username);

  const handleLogout = useCallback(() => {
    logout?.();
    navigate("/");
  }, [logout, navigate]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <BugReportIcon sx={{ display: 'flex', mr: 1 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ display: 'flex', mr: 2 }}
        >
          JadTracker
        </Typography>
        <Box sx={{ flexGrow: 1, display: 'flex' }}>
          <Button
            component={RouterLink}
            to="/projects"
            sx={{my: 2, color: 'inherit', display: 'block'}}
          >
            Projects
          </Button>
        </Box>
        {!disableLogout && (
          <Box sx={{ flexGrow: 0 }}>
            <Button
              onClick={handleOpenUserMenu}
              color="inherit"
              sx={{ p: 0, textTransform: 'none' }}
              startIcon={
                <Avatar sx={{bgcolor: stringToColor(username)}}>
                  {avatarInitials(username)}
                </Avatar>
              }
            >
              {username}
            </Button>
            <Menu
              sx={{ mt: '45px' }}
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
              <MenuItem onClick={handleLogout}>
                <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}