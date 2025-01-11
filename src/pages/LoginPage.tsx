import Box from "@mui/material/Box";
import AppNavBar from "../components/navbar/AppNavBar";
import {
  Alert,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  TextField,
  Toolbar
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Link as RouterLink, useLocation, useNavigate} from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";
import {FormEvent, useCallback, useState} from "react";
import ErrorAlert from "../components/core/ErrorAlert";

interface LoginPageErrors {
  usernameFieldError?: string;
  passwordFieldError?: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formErrors, setFormErrors] = useState<LoginPageErrors>({});
  const {login, isAuthenticating, loginError} = useAuth();
  const {state} = useLocation();
  const navigate = useNavigate();

  const handleLogin = useCallback((e: FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const foundErrors: LoginPageErrors = {};

    if (username.trim() === "") {
      foundErrors.usernameFieldError = "Username is required";
      hasErrors = true;
    }

    if (password.trim() === "") {
      foundErrors.passwordFieldError = "Password is required";
      hasErrors = true;
    }

    setFormErrors(foundErrors);
    if (hasErrors) return;

    login?.(username, password).then(() => {
      navigate(state?.path ?? "/");
    }, () => {});
  }, [username, password, login, state, navigate]);

  return (
    <Box sx={{display: 'flex'}}>
      <AppNavBar disableLogout={true} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Paper sx={{p: 2.5}} >
            <Typography variant="h5">
              Welcome to JadTracker! Please login to continue.
            </Typography>
            <Stack
              component="form"
              autoComplete="off"
              spacing={3}
              sx={{pt: 4}}
              onSubmit={handleLogin}
            >
              <TextField
                label="Username"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                label="Password"
                variant="outlined"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                  variant="contained"
                  sx={{width: '100%'}}
                  disabled={isAuthenticating}
                  type="submit"
                >
                  Login
                </Button>
                {isAuthenticating && (
                  <CircularProgress
                    size={24}
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </Box>
              {(Object.keys(formErrors).length > 0 || loginError) && (
                <Stack spacing={1}>
                  {Object.keys(formErrors).length > 0 && (
                    <Alert severity="warning">
                      {Object.entries(formErrors).map(([key, value]) =>
                        <Typography key={key} variant="body2">
                          {value}
                        </Typography>
                      )}
                    </Alert>
                  )}
                  {loginError && (
                    <ErrorAlert error={loginError} />
                  )}
                </Stack>
              )}
              <Link component={RouterLink} to="/register">
                Don't have an account? Register
              </Link>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}