import {
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  styled
} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from '@mui/icons-material/Edit';
import React, {useContext, useEffect, useState} from "react";
import {Issue, IssueStatusType} from "../../services/IssueService";
import Box from "@mui/material/Box";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import CommentLine from "../comments/CommentLine";
import {commentService, Comment} from "../../services/CommentService";
import useAuth from "../../hooks/auth/useAuth";
import CommentEditLine from "../comments/CommentEditLine";
import {IssueActionContext} from "./IssueProvider";
import {CurrentProjectContext} from "../projects/CurrentProjectProvider";

interface IssueDetailDialogProps {
  setIsDialogOpen:  React.Dispatch<React.SetStateAction<boolean>>
  setIsEditing:  React.Dispatch<React.SetStateAction<boolean>>
  dialogIssue: Issue;
  setDialogIssue:  React.Dispatch<React.SetStateAction<Issue>>;
}

export default function IssueDetailDialog({setIsDialogOpen, setIsEditing, dialogIssue, setDialogIssue}: IssueDetailDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const {token} = useAuth();

  const {updateIssue} = useContext(IssueActionContext);
  const projectId = useContext(CurrentProjectContext)!.id;

  useEffect(() => {
    commentService.getCommentsForIssue(dialogIssue, token)
      .then(savedComments => {
        setComments(savedComments);
      })
  }, []);

  const ExitButton = styled(CloseIcon)(() => ({
    padding: "3px",
    fontSize: "2em",
    '&:hover': {
      borderRadius: "2px",
      backgroundColor: "#e0e0e0",
    },
  }));

  const EditButton = styled(EditIcon)(() => ({
    padding: "3px",
    fontSize: "2em",
    '&:hover': {
      borderRadius: "2px",
      backgroundColor: "#e0e0e0",
    },
  }))

  const handleStatusChange = (event: SelectChangeEvent) => {
    const issue = {
      ...dialogIssue,
      status: event.target.value as IssueStatusType,
    };
    updateIssue(projectId, issue);
    setDialogIssue(issue);
  };

  return (
    <Stack spacing={4} sx={{minWidth: "500px", minHeight: "300px", margin: "20px"}}>
      <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
        <Typography variant="h1" fontSize={24} fontWeight={400}>
          {dialogIssue?.summary}
        </Typography>
        <Stack direction="row" spacing={1}>
          <EditButton onClick={() => setIsEditing(true)}/>
          <ExitButton onClick={() => setIsDialogOpen(false)}/>
        </Stack>
      </Stack>

      <Stack direction="row" sx={{justifyContent: "space-between"}}>
        <Box>
          <Typography variant="h3" fontSize={16} fontWeight={600} margin="5px">
            Description
          </Typography>
          <Typography variant="body1" whiteSpace="break-spaces"
                      sx={{border: "1px solid #bdbdbd", borderRadius: "5px", padding: "10px", minWidth: "350px"}}>
            {dialogIssue.description}
          </Typography>

          <Stack spacing={1} sx={{marginTop: "50px"}}>
            <CommentEditLine/>
            {comments.map(comment => (
              <CommentLine comment={comment} key={comment.id}/>
            ))}
          </Stack>
        </Box>

        <Stack sx={{border: "1px solid #bdbdbd", borderRadius: "5px", padding: "10px", minWidth: "250px"}}>
          <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
            <InputLabel id="details-dialog-status-label">Status</InputLabel>
            <Select labelId="details-dialog-status-label"
                    value={dialogIssue?.status}
                    onChange={handleStatusChange}
            >
              <MenuItem value="TODO">To Do</MenuItem>
              <MenuItem value="DOING">In Progress</MenuItem>
              <MenuItem value="DONE">Done</MenuItem>
            </Select>
          </FormControl>

          <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "baseline", marginTop: "20px"}}>
            <Typography sx={{fontSize: 14, color: "#19857b", marginRight: "40px"}}>Assignee</Typography>
            <Stack direction="row" sx={{justifyContent: "right", alignItems: "baseline"}}>
              <Avatar variant="rounded"
                      sx={{
                        bgcolor: stringToColor(dialogIssue.assignee),
                        width: "25px",
                        height: "25px",
                        fontSize: "small"
                      }}>
                {avatarInitials(dialogIssue.assignee)}
              </Avatar>
              <Typography sx={{fontSize: 14, marginLeft: "5px", color: "secondary"}}>{dialogIssue.assignee}</Typography>
            </Stack>
          </Stack>

          <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "baseline", marginTop: "20px"}}>
            <Typography sx={{fontSize: 14, color: "#19857b", marginRight: "40px"}}>Type</Typography>
            <Stack direction="row" sx={{justifyContent: "right", alignItems: "baseline"}}>
              <Typography sx={{
                fontSize: 14,
                color: "secondary",
                textTransform: "capitalize"
              }}>{dialogIssue.type.toLowerCase()}</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}