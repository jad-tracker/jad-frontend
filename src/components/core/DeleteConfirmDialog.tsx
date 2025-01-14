import {Button, Dialog, DialogActions, DialogContent} from "@mui/material";
import React from "react";

interface DeleteConfirmDialogProps {
  isOpen: boolean,
  setIsOpen:  React.Dispatch<React.SetStateAction<boolean>>,
  description: string,
  onConfirm: () => void,
}

export default function DeleteConfirmDialog({isOpen, setIsOpen, description, onConfirm}: DeleteConfirmDialogProps) {
  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  const handleConfirm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    onConfirm();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogContent> {`Are you sure you want to delete ${description}?`}</DialogContent>
      <DialogActions>
        <Button onClick={e => handleConfirm(e)} color="error">Delete</Button>
        <Button onClick={e => handleCancel(e)}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}