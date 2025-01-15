import {Avatar, Button, Stack, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import React, {useContext, useState} from "react";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import useAuth from "../../hooks/auth/useAuth";
import {CommentActionContext} from "./CommentProvider";
import {Issue} from "../../services/IssueService";
import {UserComment} from "../../services/CommentService"

interface CommentEditLineProps {
  currentIssue: Issue
}

export default function CommentCreateLine({currentIssue}: CommentEditLineProps){
  const {username} = useAuth();
  const {addComment} = useContext(CommentActionContext);

  const [contents, setContents] = useState<string>("");
  const [isPostDisabled, setIsPostDisabled] = useState<boolean>(true);

  const handlePost = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const comment: UserComment = {
      id: 0,
      content: contents,
      date: new Date(Date.now()),
      username
    }
    addComment(currentIssue.id, comment);
    setContents("");
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 0) {
      setIsPostDisabled(false);
    } else {
      setIsPostDisabled(true);
    }
    setContents(value);
  }

  return (
    <Stack sx={{border: "2px dashed #bdbdbd", borderRadius: "10px", padding: "10px"}}>
      <Stack direction="row" spacing={2} sx={{justifyContent: "start", alignItems: "center", margin: "5px 5px"}}>
        <Avatar variant="circular"
                sx={{
                  bgcolor: stringToColor(username),
                  fontSize: "medium"
                }}>
          {avatarInitials(username)}
        </Avatar>
        <Typography sx={{color: "#44546F"}}>{username}</Typography>
      </Stack>

      <TextField multiline minRows={2} value={contents} onChange={handleChange}/>
      <Stack direction="row" sx={{justifyContent: "end", margin: "10px 0"}}>
        <Button variant="outlined" size="small" color="primary" onClick={handlePost} disabled={isPostDisabled}>Post Comment</Button>
      </Stack>
    </Stack>
  );
}