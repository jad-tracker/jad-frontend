import {
  Dialog,
  styled
} from "@mui/material";
import React from "react";
import {Issue} from "../../services/IssueService";
import IssueDetailDialog from "./IssueDetailDialog";
import IssueEditDialog from "./IssueEditDialog";

interface IssueDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  dialogIssue: Issue;
  setDialogIssue: React.Dispatch<React.SetStateAction<Issue>>;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
}

export default function IssueDialog({isDialogOpen, setIsDialogOpen, isEditing, setIsEditing, dialogIssue,
                                      setDialogIssue, isCreating, setIsCreating}: IssueDialogProps) {
  const LargeDialog = styled(Dialog)(() => ({
    "& .MuiDialog-container": {
      "& .MuiPaper-root": {
        width: "100%",
        maxWidth: "800px",
        margin: "50px",
      },
    },
  }))

  return (
    <LargeDialog open={isDialogOpen}
                 onClose={() => setIsDialogOpen(false)}
    >
      {isEditing ?
        <IssueEditDialog setIsDialogOpen={setIsDialogOpen} dialogIssue={dialogIssue} setDialogIssue={setDialogIssue}
                         setIsEditing={setIsEditing} isCreating={isCreating} setIsCreating={setIsCreating}/>
        : <IssueDetailDialog setIsDialogOpen={setIsDialogOpen} dialogIssue={dialogIssue} setIsEditing={setIsEditing}
                             setDialogIssue={setDialogIssue}/>
      }
    </LargeDialog>
  );
}