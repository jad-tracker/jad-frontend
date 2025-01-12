import {Button, CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";
import {ReactNode} from "react";

interface LoadingButtonProps {
  operating: boolean;
  onClick: () => void;
  children: ReactNode;
}

export default function LoadingButton({operating, onClick, children}: LoadingButtonProps) {
  return (
    <Box sx={{m: 1, position: 'relative'}}>
      <Button
        variant="contained"
        sx={{width: '100%'}}
        disabled={operating}
        onClick={onClick}
      >
        {children}
      </Button>
      {operating && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            marginTop: '-12px',
            marginLeft: '-12px'
          }}
        />
      )}
    </Box>
  );
}