import {createContext, ReactNode, useCallback, useEffect, useRef, useState} from "react";
import useLocalStorage from "../../hooks/core/useLocalStorage";
import {User, userService} from "../../services/UserService";
import {ApiError} from "../../services/ApiError";

type LoginFunction = (username: string, password: string) => Promise<void>;
type LogoutFunction = () => void;
type RegisterFunction = (username: string, password: string, confirmPassword: string) => Promise<void>;

interface AuthState {
  authenticated: boolean;
  isAuthenticating: boolean;
  loginError: ApiError | null;
  registerError: ApiError | null;
  token: string;
  login?: LoginFunction;
  logout?: LogoutFunction;
  register?: RegisterFunction;
}

const initialState: AuthState = {
  authenticated: false,
  isAuthenticating: false,
  loginError: null,
  registerError: null,
  token: "",
};

export const AuthContext = createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>(initialState);
  const {getValue, setValue} = useLocalStorage<User>("auth", {token: "", expiresIn: 0});
  const shouldSetupInvalidateToken = useRef<Boolean>(false);
  const expirationTime = useRef<number>(0);

  useEffect(loadTokenEffect, []);
  useEffect(invalidateTokenEffect, [shouldSetupInvalidateToken.current]);

  const login = useCallback(async (username: string, password: string) => {
    setAuthState({
      ...authState,
      isAuthenticating: true,
      loginError: null,
    });

    try {
      const user = await userService.login(username, password);
      setValue(user);

      setAuthState({
        ...authState,
        authenticated: true,
        token: user.token,
        isAuthenticating: false,
        loginError: null,
      });

      expirationTime.current = user.expiresIn;
      shouldSetupInvalidateToken.current = true;
    } catch (error) {
      setAuthState({
        ...authState,
        isAuthenticating: false,
        loginError: error as ApiError,
      });

      throw error as ApiError;
    }
  }, [setValue, userService, authState, shouldSetupInvalidateToken, expirationTime]);

  const logout = useCallback(() => {
    setValue({token: "", expiresIn: 0});

    setAuthState({
      ...authState,
      authenticated: false,
      token: "",
    });
  }, [authState, setValue]);

  const register = useCallback(async (username: string, password: string, confirmPassword: string) => {
    setAuthState({
      ...authState,
      isAuthenticating: true,
      registerError: null,
    });

    try {
      await userService.register(username, password, confirmPassword);

      setAuthState({
        ...authState,
        isAuthenticating: false,
        registerError: null,
      });
    } catch (error) {
      setAuthState({
        ...authState,
        isAuthenticating: false,
        registerError: error as ApiError,
      });

      throw error as ApiError;
    }
  }, [userService, authState]);

  const {authenticated, token, loginError, registerError, isAuthenticating} = authState;
  const value = {
    authenticated, token, loginError, registerError, isAuthenticating,
    login, logout, register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );

  function loadTokenEffect() {
    const { token, expirationDate } = getValue();

    if (token.trim() !== "") {
      if (expirationDate && new Date(expirationDate) < new Date()) {
        setValue({token: "", expiresIn: 0});
        setAuthState({
          ...authState,
          authenticated: false,
          token: "",
        });

        return;
      }

      setAuthState({
        ...authState,
        authenticated: true,
        token,
      });
    }
  }

  function invalidateTokenEffect() {
    if (shouldSetupInvalidateToken.current) {
      shouldSetupInvalidateToken.current = false;

      const handle = setTimeout(() => {
        setValue({token: "", expiresIn: 0});
        setAuthState({
          ...authState,
          authenticated: false,
          token: "",
        });
      }, expirationTime.current);

      return () => clearTimeout(handle);
    }
  }
}