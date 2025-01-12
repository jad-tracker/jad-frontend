import {Project} from "../../services/ProjectService";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import {useContext, useState} from "react";
import {ProjectContext} from "./ProjectProvider";
import LoadingButton from "../core/LoadingButton";
import ErrorSnackbar from "../core/ErrorSnackbar";

interface RenameProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

interface RenameProjectErrors {
  nameFieldError?: string;
}

export default function RenameProjectDialog({ open, onClose, project }: RenameProjectDialogProps) {
  const {renameProject, operating, renameError} = useContext(ProjectContext);
  const [name, setName] = useState<string>(project.name);
  const [renameProjectErrors, setRenameProjectErrors] = useState<RenameProjectErrors>({});

  const handleRenameProject = () => {
    let hasErrors = false;
    const foundErrors: RenameProjectErrors = {};

    if (!name || name.trim().length === 0) {
      foundErrors.nameFieldError = 'Project name is required';
      hasErrors = true;
    }

    setRenameProjectErrors(foundErrors);
    if (hasErrors) return;

    renameProject?.(project.id, name).then((_) => {
      onClose();
    }, () => {});
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>{`Rename ${project.name}`}</DialogTitle>
      <DialogContent>
        <Stack
          component="form"
          autoComplete="off"
          spacing={2}
          sx={{pt: 1}}
        >
          <TextField
            label="Project Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!renameProjectErrors.nameFieldError}
            helperText={renameProjectErrors.nameFieldError}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          operating={operating}
          onClick={handleRenameProject}
        >
          Rename
        </LoadingButton>
      </DialogActions>
      {renameError && (
        <ErrorSnackbar error={renameError} />
      )}
    </Dialog>
  );
}