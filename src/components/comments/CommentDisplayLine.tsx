import {UserComment} from "../../services/CommentService";
import {Issue} from "../../services/IssueService";
import {Avatar, Button, Stack} from "@mui/material";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import Typography from "@mui/material/Typography";
import formatDate from "../../utils/DateUtils";
import React, {useContext} from "react";
import useAuth from "../../hooks/auth/useAuth";
import {CommentActionContext} from "./CommentProvider";

interface CommentDisplayLineProps {
  comment: UserComment;
  currentIssue: Issue;
  setIsEditing: (isEditing: boolean) => void;
}

export default function CommentDisplayLine({comment, currentIssue, setIsEditing}: CommentDisplayLineProps) {
  const {username} = useAuth();

  const {deleteComment} = useContext(CommentActionContext);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    deleteComment(currentIssue.id, comment);
  }

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsEditing(true);
  }

  return (
    <Stack sx={{border: "1px solid #bdbdbd", borderRadius: "5px", padding: " 10px 20px", minWidth: "250px"}}>

      <Stack direction="row" spacing={2} sx={{justifyContent: "space-between", margin: "0px 0 15px 0px", alignItems: "baseline"}}>
        <Stack direction="row" spacing={1} sx={{alignItems: "baseline"}}>
          <Avatar variant="circular"
                  sx={{
                    bgcolor: stringToColor(comment.username),
                    width: "40px",
                    height: "40px",
                    fontSize: "large"
                  }}
          >
            {avatarInitials(comment.username)}
          </Avatar>
          <Typography sx={{color: "#44546F", fontWeight: 300}}>{comment.username}</Typography>
        </Stack>

        <Typography sx={{color: "#44546F", fontWeight: 300}}>{formatDate(new Date(comment.date))}</Typography>
      </Stack>

      <Typography variant="body1" whiteSpace="pre-wrap"
                  sx={{minWidth: "350px", overflowWrap: "break-word", fontWeight: 400}}>
        {comment.content}
      </Typography>
      {
        (username == comment.username) &&
          <Stack direction="row" sx={{justifyContent: "end"}}>
              <Button variant="text" size="small" sx={{color: "#44546F", fontWeight: 300}} onClick={handleEdit}>Edit</Button>
              <Button variant="text" size="small" sx={{color: "#44546F", fontWeight: 300}} onClick={handleDelete}>Delete</Button>
          </Stack>
      }
    </Stack>
  );
}