import {ApiError} from "../../services/ApiError";
import {Snackbar} from "@mui/material";
import ErrorAlert from "./ErrorAlert";
import {SyntheticEvent, useCallback, useState} from "react";
import Box from "@mui/material/Box";

interface ErrorSnackbarProps {
  error: ApiError;
  autoHideDuration?: number;
}

export default function ErrorSnackbar({error, autoHideDuration = 5000}: ErrorSnackbarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = useCallback((_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsOpen(false);
  }, []);

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <Box>
        <ErrorAlert
          error={error}
          onClose={handleClose}
          fullWidth
        />
      </Box>
    </Snackbar>
  );
}