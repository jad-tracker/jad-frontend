import {
  Alert,
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
import {Issue, IssueStatusType, IssueTypeType, isValidIssue} from "../../services/IssueService";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import {ProjectMemberContext} from "../project-members/ProjectMemberProvider";
import {IssueActionContext} from "./IssueProvider";
import {CurrentProjectContext} from "../projects/CurrentProjectProvider";

interface IssueDetailDialogProps {
  setIsDialogOpen:  React.Dispatch<React.SetStateAction<boolean>>
  setIsEditing:  React.Dispatch<React.SetStateAction<boolean>>
  dialogIssue: Issue;
  setDialogIssue: React.Dispatch<React.SetStateAction<Issue>>;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function IssueEditDialog({setIsDialogOpen, setIsEditing, dialogIssue, setDialogIssue, isCreating, setIsCreating}: IssueDetailDialogProps) {
  const [editSummary, setEditSummary] = useState<string>(dialogIssue.summary);
  const [editStatus, setEditStatus] = useState<IssueStatusType>(dialogIssue.status);
  const [editType, setEditType] = useState<IssueTypeType>(dialogIssue.type);
  const [editDescription, setEditDescription] = useState<string>(dialogIssue.description);
  const [editAssignee, setEditAssignee] = useState<string>(dialogIssue.assignee);

  const [summaryError, setSummaryError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [assigneeError, setAssigneeError] = useState<boolean>(false);

  const {members: projectMembers} = useContext(ProjectMemberContext);
  const {addIssue, updateIssue} = useContext(IssueActionContext);
  const projectId = useContext(CurrentProjectContext)!.id;

  const ExitButton = styled(CloseIcon)(() => ({
    padding: "3px",
    fontSize: "2em",
    '&:hover': {
      borderRadius: "2px",
      backgroundColor: "#e0e0e0",
    },
  }));

  const CustomAlert = styled(Alert)(() => ({
  }))

  const handleSummaryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditSummary(e.target.value)
    setSummaryError(false);
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditDescription(e.target.value)
    setDescriptionError(false);
  }

  const handleSave = () => {
    let issue: Issue;
    if (isCreating) {
      issue = {
        id: -1,
        date: new Date(Date.now()),
        assignee: editAssignee,
        summary: editSummary,
        status: editStatus,
        type: editType,
        description: editDescription
      };

      if (!isValidIssue(issue)) {
        if (editSummary.length == 0) setSummaryError(true);
        if (editDescription.length == 0) setDescriptionError(true);
        if (editAssignee.length == 0) setAssigneeError(true);
        return;
      }

      addIssue(projectId, issue);
    } else {
      issue = {
        ...dialogIssue,
        assignee: editAssignee,
        summary: editSummary,
        status: editStatus,
        type: editType,
        description: editDescription
      };

      if (!isValidIssue(issue)) {
        if (editSummary.length == 0) setSummaryError(true);
        if (editDescription.length == 0) setDescriptionError(true);
        if (editAssignee.length == 0) setAssigneeError(true);
        return;
      }

      updateIssue(projectId, issue);
    }

    setDialogIssue(issue);
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
            {isCreating ? "Create Issue" : "Edit Issue"}
          </Typography>

          <Stack direction="row" spacing={1}>
            <ExitButton onClick={() => setIsDialogOpen(false)}/>
          </Stack>
        </Stack>
        <Stack direction="row" sx={{justifyContent: "space-between"}}>
          <Stack spacing={2}>
            <TextField label="Issue Summary" size="medium" sx={{minWidth: "350px"}} value={editSummary} required={true}
                       onChange={handleSummaryChange} error={summaryError}/>
            <TextField multiline value={editDescription} error={descriptionError}
                       onChange={handleDescriptionChange}
                       label="Description" variant="outlined" minRows={4} required={true} sx={{minWidth: "350px"}}
            />
          </Stack>

          <Stack>
            <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
              <InputLabel id="details-dialog-status-label">Status</InputLabel>
              <Select labelId="details-dialog-status-label"
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value as IssueStatusType)}
              >
                <MenuItem value="TODO">To Do</MenuItem>
                <MenuItem value="DOING">In Progress</MenuItem>
                <MenuItem value="DONE">Done</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="standard" sx={{m: 1, minWidth: 200}}>
              <InputLabel id="details-dialog-assignee-label">Assignee</InputLabel>
              <Select labelId="details-dialog-assignee-label"
                      value={editAssignee} error={assigneeError}
                      onChange={e => {setEditAssignee(e.target.value); setAssigneeError(false)}}
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
                      onChange={e => setEditType(e.target.value as IssueTypeType)}
              >
                <MenuItem value="STORY">Story</MenuItem>
                <MenuItem value="TASK">Task</MenuItem>
                <MenuItem value="BUG">Bug</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Stack>
      </Stack>

      <Stack spacing={2} marginTop={"20px"}>
        {summaryError &&  <CustomAlert severity="error">Invalid summary</CustomAlert>}
        {descriptionError && <CustomAlert severity="error">Invalid description</CustomAlert>}
        {assigneeError && <CustomAlert severity="error">Invalid assignee</CustomAlert>}
      </Stack>

      <DialogActions sx={{justifySelf: "flex-end"}}>
        <Button color="primary" variant="contained" onClick={handleSave}>Save</Button>
        <Button sx={{color: "#9e9e9e", borderColor: "#9e9e9e"}} variant="outlined"
                onClick={() => setIsEditing(false)}>Cancel</Button>
      </DialogActions>
    </Stack>
  );
}