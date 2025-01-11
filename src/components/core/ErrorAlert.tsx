import {ApiError} from "../../services/ApiError";
import {Alert, AlertTitle} from "@mui/material";
import {SyntheticEvent} from "react";

interface ErrorAlertProps {
  error: ApiError;
  onClose?: (event?: SyntheticEvent | Event, reason?: string) => void
  fullWidth?: boolean;
}

export default function ErrorAlert({error, onClose, fullWidth}: ErrorAlertProps) {
  return error.details ? (
    <Alert severity="error" onClose={onClose} sx={{width: fullWidth ? "100%" : undefined}}>
      <AlertTitle>{error.errorMessage}</AlertTitle>
      {error.details}
    </Alert>
  ) : (
    <Alert severity="error" onClose={onClose} sx={{width: fullWidth ? "100%" : undefined}}>
      {error.errorMessage}
    </Alert>
  );
}