import Box from "@mui/material/Box";
import AppNavBar from "../components/navbar/AppNavBar";
import {Alert, Button, CircularProgress, Link, Paper, Stack, TextField, Toolbar} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import useAuth from "../hooks/auth/useAuth";
import {FormEvent, useCallback, useState} from "react";
import ErrorAlert from "../components/core/ErrorAlert";

interface RegisterPageErrors {
  usernameFieldError?: string;
  passwordFieldError?: string;
  confirmPasswordFieldError?: string;
  passwordMismatchError?: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [formErrors, setFormErrors] = useState<RegisterPageErrors>({});
  const {register, isAuthenticating, registerError} = useAuth();
  const navigate = useNavigate();

  const handleRegister = useCallback((e: FormEvent) => {
    e.preventDefault();

    let hasErrors = false;
    const foundErrors: RegisterPageErrors = {};

    if (username.trim() === "") {
      foundErrors.usernameFieldError = "Username field is required";
      hasErrors = true;
    }

    if (password.trim() === "") {
      foundErrors.passwordFieldError = "Password field is required";
      hasErrors = true;
    }

    if (confirmPassword.trim() === "") {
      foundErrors.confirmPasswordFieldError = "Repeat password field is required";
      hasErrors = true;
    }

    if (password !== confirmPassword) {
      foundErrors.passwordMismatchError = "Passwords do not match";
      hasErrors = true;
    }

    setFormErrors(foundErrors);
    if (hasErrors) return;

    register?.(username, password, confirmPassword).then(() => {
      navigate("/login");
    }, () => {});
  }, [username, password, confirmPassword, register, navigate]);

  return (
    <Box sx={{display: 'flex'}}>
      <AppNavBar disableLogout={true} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <Paper sx={{p: 2.5}} >
            <Typography variant="h5">
              Welcome to JadTracker! Register here.
            </Typography>
            <Stack
              component="form"
              autoComplete="off"
              spacing={3}
              sx={{pt: 4}}
              onSubmit={handleRegister}
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
              <TextField
                label="Repeat password"
                variant="outlined"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Box sx={{ m: 1, position: 'relative' }}>
                <Button
                  variant="contained"
                  sx={{width: '100%'}}
                  disabled={isAuthenticating}
                  type="submit"
                >
                  Register
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
              {(Object.keys(formErrors).length > 0 || registerError) && (
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
                  {registerError && (
                    <ErrorAlert error={registerError} />
                  )}
                </Stack>
              )}
              <Link component={RouterLink} to="/login">
                Already have an account? Login
              </Link>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}