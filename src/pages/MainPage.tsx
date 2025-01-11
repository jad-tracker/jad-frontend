import Box from "@mui/material/Box";
import AppNavBar from "../components/navbar/AppNavBar";
import {Toolbar} from "@mui/material";
import {Outlet} from "react-router-dom";

export default function MainPage() {
  return (
    <Box sx={{display: 'flex'}}>
      <AppNavBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <h1>Main Page</h1>
        <Outlet />
      </Box>
    </Box>
  );
}