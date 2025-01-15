import {Avatar, Card, CardContent, Chip, Stack, styled} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Issue} from "../../services/IssueService";
import {useDrag} from "react-dnd";
import {DraggableTypes} from "../../pages/ProjectPage";
import CloseIcon from '@mui/icons-material/Close';
import DeleteConfirmDialog from "../core/DeleteConfirmDialog";
import React, {useContext, useState} from "react";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import {Project} from "../../services/ProjectService";
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import StickyNote2OutlinedIcon from '@mui/icons-material/StickyNote2Outlined';
import {IssueActionContext} from "./IssueProvider";

interface IssueCardProps {
  issue: Issue,
  project: Project,
  clickHandler: (issue: Issue) => void,
}

export default function IssueCard({issue, project, clickHandler}: IssueCardProps) {
  const {deleteIssue} = useContext(IssueActionContext);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: DraggableTypes.ISSUE,
    item: issue,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }), [issue])

  const getIssueIcon = (issueType: string) => {
    const comp = issueType.toUpperCase();
    if (comp == "BUG") {
      return <BugReportOutlinedIcon/>;
    } else if (comp == "STORY") {
      return <BookmarkBorderIcon/>
    } else {
      return <StickyNote2OutlinedIcon/>;
    }
  }

  const getIssueColor = (issueType: string) => {
    const comp = issueType.toUpperCase();
    if (comp == "BUG") {
      return "#ff7043";
    } else if (comp == "STORY") {
      return "#66bb6a";
    } else {
      return "#29b6f6";
    }
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

  const CustomChip = styled(Chip)(() => ({
    textTransform: "capitalize",
    fontWeight: 400,
    fontSize: 14,
    backgroundColor: getIssueColor(issue.type),
    color: "white",
    "& .MuiChip-icon": {
      color: "white",
    },
  }));

  return (
    <Card sx={{margin: "5px 16px", opacity: isDragging ? 0.3 : 1.0}} ref={drag} onClick={() => clickHandler(issue)}>
      <CardContent>
        <Stack sx={{justifyContent: "space-between", minHeight: "100px"}}>
          <Stack direction="row" sx={{justifyContent: "space-between", alignItems: "center"}}>
            <Typography sx={{fontSize: 16}}>{issue.summary}</Typography>
            <CloseButton fontSize="small" onClick={(e) => {
              e.stopPropagation();
              setIsDeleteDialogOpen(true)
            }}/>
          </Stack>

          <Stack direction="row" spacing={1} sx={{justifyContent: "space-between", alignItems: "center"}}>
            <CustomChip icon={getIssueIcon(issue.type)} label={issue.type.toLowerCase()}/>

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
                           description={`the issue "${issue.summary}"`}
                           onConfirm={() => deleteIssue(project.id, issue)}/>
    </Card>
  );
}