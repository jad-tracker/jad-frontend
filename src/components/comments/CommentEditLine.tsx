import {UserComment} from "../../services/CommentService";
import {Issue} from "../../services/IssueService";
import {Avatar, Button, Stack, TextField} from "@mui/material";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import Typography from "@mui/material/Typography";
import formatDate from "../../utils/DateUtils";
import React, {useContext, useState} from "react";
import useAuth from "../../hooks/auth/useAuth";
import {CommentActionContext} from "./CommentProvider";

interface CommentEditLineProps {
  comment: UserComment;
  currentIssue: Issue;
  setIsEditing: (isEditing: boolean) => void;
}

export default function CommentEditLine({comment, currentIssue, setIsEditing}: CommentEditLineProps) {
  const [contents, setContents] = useState<string>(comment.content);
  const [isSaveDisabled, setIsSaveDisabled] = useState<boolean>(true);

  const {username} = useAuth();
  const {updateComment} = useContext(CommentActionContext);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsEditing(false);
  }

  const handleSave = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const updatedComment: UserComment = {
      ...comment,
      content: contents,
      date: new Date(Date.now()),
    }
    e.stopPropagation();
    updateComment(currentIssue.id, updatedComment);
    setIsEditing(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length == 0 || value == comment.content) {
      setIsSaveDisabled(true);
    } else {
      setIsSaveDisabled(false);
    }
    setContents(value);
  }

  return (
    <Stack sx={{border: "2px dashed #bdbdbd", borderRadius: "10px", padding: " 10px 20px", minWidth: "250px"}}>

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

      <TextField multiline minRows={2} value={contents} onChange={handleChange}/>
      {/*<Typography variant="body1" whiteSpace="pre-wrap"*/}
      {/*            sx={{minWidth: "350px", overflowWrap: "break-word", fontWeight: 400}}>*/}
      {/*  {comment.content}*/}
      {/*</Typography>*/}
      {
        (username == comment.username) &&
          <Stack direction="row" sx={{justifyContent: "end"}}>
              <Button variant="text" size="small" sx={{color: "#44546F", fontWeight: 300}} onClick={handleSave} disabled={isSaveDisabled}>Save</Button>
              <Button variant="text" size="small" sx={{color: "#44546F", fontWeight: 300}} onClick={handleCancel}>Cancel</Button>
          </Stack>
      }
    </Stack>
  );
}