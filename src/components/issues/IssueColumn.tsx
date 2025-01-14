import {Issue} from "../../services/IssueService";
import {Stack, styled} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDrop} from "react-dnd";
import IssueCard from "./IssueCard";
import React, {useEffect, useState} from "react";
import {DraggableTypes} from "../../pages/ProjectPage";
import {Project} from "../../services/ProjectService";
import AddIcon from '@mui/icons-material/Add';
import IssueDialog from "./IssueDialog";

interface IssueColumnProps {
  issues: Issue[],
  statusKey: string,
  title: string,
  setAllIssues: React.Dispatch<React.SetStateAction<Issue[]>>,
  handleIssueUpdate: (issue: Issue) => void,
  handleIssueAdd: (issue: Issue) => void,
  project: Project,
}


export default function IssueColumn({issues, statusKey, title, setAllIssues, handleIssueUpdate, handleIssueAdd, project}: IssueColumnProps) {
  const [ownIssues, setOwnIssues] = useState<Issue[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

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

  const openAddIssueDialog = () => {
    setDialogIssue(newIssue)
    setIsDialogOpen(true);
    setIsEditing(true);
    setIsCreating(true);
  }

  const openEditIssueDialog = (issue: Issue) => {
    setDialogIssue(issue);
    setIsDialogOpen(true);
    setIsEditing(false);
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

  const AddIssueContainer = styled(Stack)(( ) => ({
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
          <IssueCard issue={issue} key={issue.id} project={project} issues={issues} setIssues={setAllIssues} clickHandler={openEditIssueDialog}/>
        ))}

        <AddIssueContainer direction="row" onClick={openAddIssueDialog}>
          <AddIcon sx={{color: "inherit"}}/>
          <Typography sx={{
            marginLeft: "5px",
            textTransform: "uppercase",
            color: "inherit",
            fontSize: 12
          }}>Add an Issue</Typography>
        </AddIssueContainer>
      </Stack>
      <IssueDialog isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} isEditing={isEditing}
                   setIsEditing={setIsEditing} dialogIssue={dialogIssue} setDialogIssue={setDialogIssue}
                   isCreating={isCreating} setIsCreating={setIsCreating}
                   handleIssueUpdate={handleIssueUpdate} handleIssueAdd={handleIssueAdd}/>
    </Stack>
  );
}
