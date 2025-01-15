import {Avatar, Button, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useContext, useState} from "react";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import {UserComment} from "../../services/CommentService";
import formatDate from "../../utils/DateUtils";
import useAuth from "../../hooks/auth/useAuth";
import {CommentActionContext} from "./CommentProvider";
import {Issue} from "../../services/IssueService";
import CommentDisplayLine from "./CommentDisplayLine";
import CommentEditLine from "./CommentEditLine";

interface CommentLineProps {
  comment: UserComment,
  currentIssue: Issue;
}

export default function CommentLine({comment, currentIssue}: CommentLineProps){

  const {updateComment, deleteComment} = useContext(CommentActionContext);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!isEditing) {
    return (<CommentDisplayLine comment={comment} currentIssue={currentIssue} setIsEditing={setIsEditing}/>)
  } else {
    return(<CommentEditLine comment={comment} currentIssue={currentIssue} setIsEditing={setIsEditing}/>)
  }

}