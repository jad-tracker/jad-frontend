import AppNavBar from "../components/navbar/AppNavBar";
import Box from "@mui/material/Box";
import {Link, Paper, Stack, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {Link as RouterLink} from "react-router-dom";

export default function ErrorPage() {
  return (
    <Box sx={{display: 'flex'}}>
      <AppNavBar disableLogout={true} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Paper sx={{p: 2.5}} >
            <Stack>
              <Typography variant="h5" textAlign="center">
                <ErrorOutlineIcon fontSize="medium" sx={{mr: 0.5}} /> Page not found
              </Typography>
              <Typography variant="subtitle1" textAlign="center" sx={{mb: 3}}>
                The page you were looking for was not found. Return back or go to the home page by clicking the link below
              </Typography>
              <Link component={RouterLink} to="/" textAlign="center">Go back to the home page</Link>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}