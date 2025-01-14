import {Issue, issueService} from "../../services/IssueService";
import {Dialog, DialogTitle, Stack, styled} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDrop} from "react-dnd";
import IssueCard from "./IssueCard";
import React, {useEffect, useRef, useState} from "react";
import {DraggableTypes} from "../../pages/ProjectPage";
import {Project} from "../../services/ProjectService";
import useAuth from "../../hooks/auth/useAuth";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from "@mui/icons-material/Close";
import IssueDetailDialog from "./IssueDetailDialog";

interface IssueColumnProps {
  issues: Issue[],
  statusKey: string,
  title: string,
  setAllIssues: React.Dispatch<React.SetStateAction<Issue[]>>,
  handleIssueUpdate: (issue: Issue) => void,
  project: Project,
}


export default function IssueColumn({issues, statusKey, title, setAllIssues, handleIssueUpdate, project}: IssueColumnProps) {
  const [ownIssues, setOwnIssues] = useState<Issue[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const newIssue: Issue = {
    id: -1,
    summary: "",
    description: "",
    type: "",
    status: "",
    date: new Date(Date.now()),
    assignee: ""
  }
  const [dialogIssue, setDialogIssue] = useState<Issue>(newIssue);

  useEffect(() => {
    const filtered = issues.filter(item => item.status == statusKey);
    setOwnIssues(filtered);
  }, [issues])

  const handleDrop = (droppedIssue: Issue) => {
    const updatedIssue = {
      ...droppedIssue,
      "status": statusKey
    };
    handleIssueUpdate(updatedIssue);
  }

  const handleAddIssue = () => {
    setDialogIssue(newIssue)
    setIsDialogOpen(true);
    setIsEditing(true);
  }

  const [{isDndOver}, drop] = useDrop(
    () => ({
        accept: DraggableTypes.ISSUE,
        drop: (issue: Issue) => handleDrop(issue),
        collect: monitor => ({
          // Show a IssueCard skeleton if the user is dragging an IssueCard over this column
          isDndOver: monitor.isOver()
        })
      }
    ), []
  )

  const handleIssueClick = (issue: Issue) => {
    setDialogIssue(issue);
    setIsDialogOpen(true);
    setIsEditing(false);
  }

  const AddIssueContainer = styled(Stack)(({ theme }) => ({
    alignItems: "center",
    margin: "10px 16px",
    padding: "5px",
    color: "#626F86",
    '&:hover': {
      borderRadius: "2px",
      backgroundColor: "#e0e0e0",
    },
  }));


  return (
    <Stack sx={{backgroundColor: "#F7F8F9", borderRadius: "5px", paddingTop: "10px"}}>
      <Typography sx={{
        marginLeft: "20px",
        textTransform: "uppercase",
        color: "#626F86",
        fontSize: 12
      }}>{`${title} ${ownIssues.length}`}</Typography>
      <Stack sx={{minWidth: "300px", maxWidth: "600px", minHeight: "500px", marginTop: "10px"}} ref={drop}>
        {ownIssues.map(issue => (
          <IssueCard issue={issue} key={issue.id} project={project} issues={issues} setIssues={setAllIssues} clickHandler={handleIssueClick}/>
        ))}

        <AddIssueContainer direction="row" onClick={handleAddIssue}>
          <AddIcon sx={{color: "inherit"}}/>
          <Typography sx={{
            marginLeft: "5px",
            textTransform: "uppercase",
            color: "inherit",
            fontSize: 12
          }}>Add an Issue</Typography>
        </AddIssueContainer>
      </Stack>
      <IssueDetailDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} isEditing={isEditing} setIsEditing={setIsEditing} dialogIssue={dialogIssue} setDialogIssue={setDialogIssue} handleIssueUpdate={handleIssueUpdate}/>
    </Stack>
  );
}
