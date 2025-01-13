import {Avatar, Card, CardContent, Stack, styled} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Issue, issueService} from "../../services/IssueService";
import {useDrag} from "react-dnd";
import {DraggableTypes} from "../../pages/ProjectPage";
import CloseIcon from '@mui/icons-material/Close';
import DeleteConfirmDialog from "../core/DeleteConfirmDialog";
import React, {useState} from "react";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import useAuth from "../../hooks/auth/useAuth";
import {Project} from "../../services/ProjectService";

interface IssueCardProps {
  issue: Issue,
  project: Project,
  issues: Issue[],
  setIssues: React.Dispatch<React.SetStateAction<Issue[]>>
}

export default function IssueCard({issue, project, issues, setIssues}: IssueCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DraggableTypes.ISSUE,
    item: issue,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  const {token} = useAuth();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const handleDeleteIssue = async () => {
    await issueService.deleteIssue(project, issue.id, token);
    const filtered = issues.filter(iss => {
        return iss.id != issue.id;

      })
    setIssues(filtered);
  }

  const CloseButton = styled(CloseIcon)(({ theme }) => ({
    color: "secondary",
    opacity: 0.7,
    border: "1px solid #626F86", borderRadius: "2px",
    marginLeft: "10px",
    '&:hover': {
      color: theme.palette.error.main,
      borderColor: theme.palette.error.main,
      opacity: 1.0
    },
  }));

  return (
    <Card sx={{margin: "5px 16px", opacity: isDragging ? 0.3 : 1.0}} ref={drag}>
      <CardContent>
        <Stack sx={{justifyContent: "space-between", minHeight: "100px"}}>
          <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
            <Typography sx={{fontSize: 16}}>{issue.summary} {issue.id}</Typography>
            <CloseButton fontSize="small" onClick={() => setIsDeleteDialogOpen(true)}/>
          </Stack>

          <Stack direction="row" spacing={1} sx={{justifyContent: "space-between", alignItems: "center"}}>
            <Typography color="secondary" sx={{textTransform: "capitalize", fontWeight: 300, fontSize: 12}}>
              {issue.type.toLowerCase()}
            </Typography>

            <Stack direction="row" sx={{justifyContent: "right", alignItems: "baseline"}}>
              <Avatar variant="rounded"
                      sx={{bgcolor: stringToColor(issue.assignee), width: "25px", height: "25px", fontSize: "small"}}>
                {avatarInitials(issue.assignee)}
              </Avatar>
              <Typography sx={{fontSize: 12, marginLeft: "5px"}}>{issue.assignee}</Typography>
            </Stack>
          </Stack>


        </Stack>
      </CardContent>
      <DeleteConfirmDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen}
                           description={`the issue "${issue.summary}"`} onConfirm={handleDeleteIssue}/>
    </Card>
  );
}