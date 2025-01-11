import {AppBar, Button, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import BugReportIcon from '@mui/icons-material/BugReport';
import useAuth from "../../hooks/auth/useAuth";
import {useCallback} from "react";
import {useNavigate} from "react-router-dom";

interface AppNavBarProps {
  disableLogout?: boolean;
}

export default function AppNavBar({disableLogout = false}: AppNavBarProps) {
  const {logout} = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout?.();
    navigate("/");
  }, [logout, navigate]);

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <BugReportIcon sx={{ display: 'flex', mr: 1 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          JadTracker
        </Typography>
        {!disableLogout && (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}