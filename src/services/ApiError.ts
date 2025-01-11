import axios, {AxiosError} from "axios";

export interface ApiError {
  errorMessage: string;
  details?: string;
}

export function convertError(error: AxiosError | Error) {
  if (axios.isAxiosError<ApiError, Record<string, unknown>>(error) && error.response) {
    return error.response.data;
  }

  return {
    errorMessage: error.message,
  };
}