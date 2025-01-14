import {
  Dialog,
  styled
} from "@mui/material";
import React from "react";
import {Issue} from "../../services/IssueService";
import IssueDetailDialog from "./IssueDetailDialog";
import IssueEditDialog from "./IssueEditDialog";

interface IssueDetailDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>
  handleIssueUpdate: (issue: Issue) => void;
  handleIssueAdd: (issue: Issue) => void;
  dialogIssue: Issue;
  setDialogIssue: React.Dispatch<React.SetStateAction<Issue>>;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>
}

export default function IssueDialog({
                                      isDialogOpen,
                                      setIsDialogOpen,
                                      isEditing,
                                      setIsEditing,
                                      dialogIssue,
                                      setDialogIssue,
                                      isCreating,
                                      setIsCreating,
                                      handleIssueUpdate,
                                      handleIssueAdd
                                    }: IssueDetailDialogProps) {
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
        <IssueEditDialog setIsDialogOpen={setIsDialogOpen} dialogIssue={dialogIssue} setDialogIssue={setDialogIssue} handleIssueAdd={handleIssueAdd}
                         setIsEditing={setIsEditing} handleIssueUpdate={handleIssueUpdate} isCreating={isCreating} setIsCreating={setIsCreating}/>
        : <IssueDetailDialog setIsDialogOpen={setIsDialogOpen} dialogIssue={dialogIssue} setIsEditing={setIsEditing}
                             setDialogIssue={setDialogIssue} handleIssueUpdate={handleIssueUpdate}/>
      }
    </LargeDialog>
  );
}