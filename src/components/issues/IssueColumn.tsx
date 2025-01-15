import {Issue, IssueStatusType, mapIssueStatus} from "../../services/IssueService";
import {Stack, styled} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDrop} from "react-dnd";
import IssueCard from "./IssueCard";
import React, {useContext, useEffect, useState} from "react";
import {DraggableTypes} from "../../pages/ProjectPage";
import {Project} from "../../services/ProjectService";
import AddIcon from '@mui/icons-material/Add';
import IssueDialog from "./IssueDialog";
import {IssueActionContext, IssueContext} from "./IssueProvider";

interface IssueColumnProps {
  status: IssueStatusType,
  project: Project,
}


export default function IssueColumn({status, project}: IssueColumnProps) {
  const [ownIssues, setOwnIssues] = useState<Issue[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const issues = useContext(IssueContext);
  const {updateIssue} = useContext(IssueActionContext);

  const newIssue: Issue = {
    id: -1,
    summary: "",
    description: "",
    type: "STORY",
    status: status,
    date: new Date(Date.now()),
    assignee: ""
  }
  const [dialogIssue, setDialogIssue] = useState<Issue>(newIssue);

  useEffect(() => {
    const filtered = issues.filter(item => item.status == status);
    setOwnIssues(filtered);
  }, [issues])

  const handleDrop = (droppedIssue: Issue) => {
    const updatedIssue = {
      ...droppedIssue,
      "status": status
    };
    updateIssue(project.id, updatedIssue);
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

  const [, drop] = useDrop(
    () => ({
        accept: DraggableTypes.ISSUE,
        drop: (issue: Issue) => handleDrop(issue),
        collect: monitor => ({
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
      }}>
        {`${mapIssueStatus(status)} ${ownIssues.length}`}
      </Typography>

      <Stack sx={{minWidth: "300px", maxWidth: "600px", minHeight: "500px", marginTop: "10px"}} ref={drop}>
        {ownIssues.map(issue => (
          <IssueCard issue={issue} key={issue.id} project={project} clickHandler={openEditIssueDialog}/>
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
                   isCreating={isCreating} setIsCreating={setIsCreating}/>
    </Stack>
  );
}
