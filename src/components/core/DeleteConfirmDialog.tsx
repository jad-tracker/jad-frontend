import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React from "react";

interface DeleteConfirmDialogProps {
  isOpen: boolean,
  setIsOpen,
  description: string,
  onConfirm
}

export default function DeleteConfirmDialog({isOpen, setIsOpen, description, onConfirm}: DeleteConfirmDialogProps) {
  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onConfirm();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onClose={handleCancel}>
      <DialogContent> {`Are you sure you want to delete ${description}?`}</DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color="error">Delete</Button>
        <Button onClick={handleCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
}