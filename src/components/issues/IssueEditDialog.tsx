import {
  Avatar, Button,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled, TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import React, {useContext, useState} from "react";
import {Issue} from "../../services/IssueService";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import {ProjectMemberContext} from "../project-members/ProjectMemberProvider";

interface IssueDetailDialogProps {
  setIsDialogOpen:  React.Dispatch<React.SetStateAction<boolean>>
  setIsEditing:  React.Dispatch<React.SetStateAction<boolean>>
  handleIssueUpdate: (issue: Issue) => void;
  handleIssueAdd: (issue: Issue) => void;
  dialogIssue: Issue;
  setDialogIssue: React.Dispatch<React.SetStateAction<Issue>>;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IssueEditDialog({setIsDialogOpen, setIsEditing, dialogIssue, setDialogIssue, isCreating, setIsCreating, handleIssueUpdate, handleIssueAdd}: IssueDetailDialogProps) {
  const [editSummary, setEditSummary] = useState<string>(dialogIssue.summary);
  const [editStatus, setEditStatus] = useState<string>(dialogIssue.status);
  const [editType, setEditType] = useState<string>(dialogIssue.type);
  const [editDescription, setEditDescription] = useState<string>(dialogIssue.description);
  const [editAssignee, setEditAssignee] = useState<string>(dialogIssue.assignee);

  const {members: projectMembers} = useContext(ProjectMemberContext);

  const ExitButton = styled(CloseIcon)(() => ({
    padding: "3px",
    fontSize: "2em",
    '&:hover': {
      borderRadius: "2px",
      backgroundColor: "#e0e0e0",
    },
  }));

  const handleSave = () => {
    let newIssue: Issue;
    if (isCreating) {
      newIssue = {
        id: undefined,
        date: new Date(Date.now()),
        assignee: editAssignee,
        summary: editSummary,
        status: editStatus,
        type: editType,
        description: editDescription
      };
      handleIssueAdd(newIssue);
    } else {
      newIssue = {
        ...dialogIssue,
        assignee: editAssignee,
        summary: editSummary,
        status: editStatus,
        type: editType,
        description: editDescription
      };
      handleIssueUpdate(newIssue);
    }

    setDialogIssue(newIssue);
    setIsEditing(false);
    if (isCreating) {
      setIsCreating(false);
      setIsDialogOpen(false);
    }
  }

  return (
    <Stack sx={{minWidth: "500px", minHeight: "300px", margin: "20px", justifyContent: "space-between"}}>
      <Stack spacing={4}>
        <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
          <Typography variant="h1" fontSize={24} fontWeight={400}>
            Edit Issue
          </Typography>

          <Stack direction="row" spacing={1}>
            <ExitButton onClick={() => setIsDialogOpen(false)}/>
          </Stack>
        </Stack>
        <Stack direction="row" sx={{justifyContent: "space-between"}}>
          <Stack spacing={2}>
            <TextField label="Issue Summary" size="medium" sx={{minWidth: "350px"}} value={editSummary}
                       onChange={e => setEditSummary(e.target.value)}/>
            <TextField multiline value={editDescription}
                       onChange={e => setEditDescription(e.target.value)}
                       label="Description"
                       variant="outlined"
                       minRows={4}
                       sx={{minWidth: "350px"}}
            />
          </Stack>

          <Stack>
            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
              <InputLabel id="details-dialog-status-label">Status</InputLabel>
              <Select labelId="details-dialog-status-label"
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
              >
                <MenuItem value="TODO">To Do</MenuItem>
                <MenuItem value="DOING">In Progress</MenuItem>
                <MenuItem value="DONE">Done</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{m: 1, minWidth: 200}}>
              <InputLabel id="details-dialog-assignee-label">Type</InputLabel>
              <Select labelId="details-dialog-assignee-label"
                      value={editAssignee}
                      onChange={e => setEditAssignee(e.target.value)}
              >
                {
                  projectMembers?.map(member => {
                    return (
                      <MenuItem value={member.username} key={member.userId}>
                        <Stack direction="row" spacing={1} sx={{alignItems: "baseline"}}>
                          <Avatar variant="rounded"
                                  sx={{bgcolor: stringToColor(member.username), width: "25px", height: "25px", fontSize: "small"}}>
                            {avatarInitials(member.username)}
                          </Avatar>
                          <Typography>{member.username}</Typography>
                        </Stack>

                      </MenuItem>)
                  })
                }
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
              <InputLabel id="details-dialog-type-label">Type</InputLabel>
              <Select labelId="details-dialog-type-label"
                      value={editType}
                      onChange={e => setEditType(e.target.value)}
              >
                <MenuItem value="STORY">Story</MenuItem>
                <MenuItem value="TASK">Task</MenuItem>
                <MenuItem value="BUG">Bug</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Stack>
      <DialogActions sx={{justifySelf: "flex-end"}}>
        <Button color="primary" variant="contained" onClick={handleSave}>Save</Button>
        <Button sx={{color: "#9e9e9e", borderColor: "#9e9e9e"}} variant="outlined"
                onClick={() => setIsEditing(false)}>Cancel</Button>
      </DialogActions>
    </Stack>
  );
}