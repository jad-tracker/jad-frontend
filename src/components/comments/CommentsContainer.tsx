import CommentCreateLine from "./CommentCreateLine";
import CommentLine from "./CommentLine";
import {Stack} from "@mui/material";
import React, {useContext} from "react";
import {CommentContext} from "./CommentProvider";
import {Issue} from "../../services/IssueService";

interface CommentsContainerProps {
  currentIssue: Issue
}

export default function CommentsContainer({currentIssue}: CommentsContainerProps) {
  const comments = useContext(CommentContext);

  return (
    <Stack spacing={1} sx={{marginBottom: "50px", maxWidth: "400px"}}>
      <CommentCreateLine currentIssue={currentIssue}/>
      {comments.map(comment => (
        <CommentLine comment={comment} currentIssue={currentIssue} key={comment.id}/>
      ))}
    </Stack>
  );
}