import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import theme from './theme';
import App from './App';
import AuthProvider from "./components/auth/AuthProvider";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DndProvider backend={ HTML5Backend }>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </DndProvider>
  </React.StrictMode>,
);
