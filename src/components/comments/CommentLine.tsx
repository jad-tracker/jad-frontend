import React, {useContext, useState} from "react";
import {UserComment} from "../../services/CommentService";
import {CommentActionContext} from "./CommentProvider";
import {Issue} from "../../services/IssueService";
import CommentDisplayLine from "./CommentDisplayLine";
import CommentEditLine from "./CommentEditLine";

interface CommentLineProps {
  comment: UserComment,
  currentIssue: Issue;
}

export default function CommentLine({comment, currentIssue}: CommentLineProps){
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!isEditing) {
    return (<CommentDisplayLine comment={comment} currentIssue={currentIssue} setIsEditing={setIsEditing}/>)
  } else {
    return (<CommentEditLine comment={comment} currentIssue={currentIssue} setIsEditing={setIsEditing}/>)
  }

}