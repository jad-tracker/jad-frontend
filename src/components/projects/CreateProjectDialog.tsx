import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField} from "@mui/material";
import {useContext, useState} from "react";
import {ProjectContext} from "./ProjectProvider";
import LoadingButton from "../core/LoadingButton";
import ErrorSnackbar from "../core/ErrorSnackbar";

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

interface CreateProjectErrors {
  nameFieldError?: string;
  descriptionFieldError?: string;
}

export default function CreateProjectDialog({ open, onClose }: CreateProjectDialogProps) {
  const {createProject, operating, saveError} = useContext(ProjectContext);
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [createProjectErrors, setCreateProjectErrors] = useState<CreateProjectErrors>({});

  const handleCreateProject = () => {
    let hasErrors = false;
    const foundErrors: CreateProjectErrors = {};

    if (!name || name.trim().length === 0) {
      foundErrors.nameFieldError = 'Project name is required';
      hasErrors = true;
    }

    if (!description || description.trim().length === 0) {
      foundErrors.descriptionFieldError = 'Project description is required';
      hasErrors = true;
    }

    setCreateProjectErrors(foundErrors);
    if (hasErrors) return;

    createProject?.(name, description).then((_) => {
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
      <DialogTitle>Create a new Project</DialogTitle>
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
            error={!!createProjectErrors.nameFieldError}
            helperText={createProjectErrors.nameFieldError}
          />
          <TextField
            label="Project Description"
            variant="outlined"
            multiline
            maxRows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={!!createProjectErrors.descriptionFieldError}
            helperText={createProjectErrors.descriptionFieldError}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <LoadingButton
          operating={operating}
          onClick={handleCreateProject}
        >
          Create
        </LoadingButton>
      </DialogActions>
      {saveError && (
        <ErrorSnackbar error={saveError} />
      )}
    </Dialog>
  );
}