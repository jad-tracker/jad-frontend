import {ProjectMember} from "../../services/ProjectService";
import {useContext, useState} from "react";
import {ProjectMemberContext} from "./ProjectMemberProvider";
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List, ListItem, ListItemAvatar, ListItemText,
  Stack,
  TextField
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import ErrorSnackbar from "../core/ErrorSnackbar";
import LoadingButton from "../core/LoadingButton";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import ProjectMemberItem from "./ProjectMemberItem";

interface ProjectMembersDialogProps {
  open: boolean;
  onClose: () => void;
  lead: string;
  members: ProjectMember[];
  editable: boolean;
}

interface AddMemberErrors {
  usernameFieldError?: string;
  roleFieldError?: string;
}

export default function ProjectMembersDialog({open, onClose, lead, members, editable}: ProjectMembersDialogProps) {
  const {addMember, operating, saveError, deleteError} = useContext(ProjectMemberContext);
  const [username, setUsername] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [addMemberErrors, setAddMemberErrors] = useState<AddMemberErrors>({});

  const handleAddMember = () => {
    let hasErrors = false;
    const foundErrors: AddMemberErrors = {};

    if (!username || username.trim().length === 0) {
      foundErrors.usernameFieldError = 'Username is required';
      hasErrors = true;
    }

    if (username === lead) {
      foundErrors.usernameFieldError = 'User is already the lead';
      hasErrors = true;
    }

    if (members.some(member => member.username === username)) {
      foundErrors.usernameFieldError = 'User is already a member';
      hasErrors = true;
    }

    if (!role || role.trim().length === 0) {
      foundErrors.roleFieldError = 'Role is required';
      hasErrors = true;
    }

    setAddMemberErrors(foundErrors);
    if (hasErrors) return;

    addMember?.(username, role).then((_) => {
      setUsername('');
      setRole('');
      setAddMemberErrors({});
    }, () => {});
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      scroll="paper"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Project Members</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          {editable && (
            <Grid
              container
              direction="row"
              spacing={2}
              sx={{
                pt: 1,
                alignItems: 'center',
              }}
            >
              <Grid size={4}>
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={!!addMemberErrors.usernameFieldError}
                  helperText={addMemberErrors.usernameFieldError}
                />
              </Grid>
              <Grid size={4}>
                <TextField
                  label="Role"
                  variant="outlined"
                  fullWidth
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  error={!!addMemberErrors.roleFieldError}
                  helperText={addMemberErrors.roleFieldError}
                />
              </Grid>
              <Grid size={4}>
                <LoadingButton
                  operating={operating}
                  onClick={handleAddMember}
                >
                  Add Member
                </LoadingButton>
              </Grid>
            </Grid>
          )}
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{bgcolor: stringToColor(lead)}}>{avatarInitials(lead)}</Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={lead}
                secondary="Lead"
              />
            </ListItem>
            {members.map(member => (
              <ProjectMemberItem
                key={member.username}
                member={member}
                editable={editable}
              />
            ))}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
      {saveError && (
        <ErrorSnackbar error={saveError}/>
      )}
      {deleteError && (
        <ErrorSnackbar error={deleteError}/>
      )}
    </Dialog>
  );
}