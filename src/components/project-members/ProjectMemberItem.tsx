import {Avatar, IconButton, ListItem, ListItemAvatar, ListItemText, Stack} from "@mui/material";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import {ProjectMember} from "../../services/ProjectService";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {useContext, useState} from "react";
import {ProjectMemberContext} from "./ProjectMemberProvider";

interface ProjectMemberItemProps {
  member: ProjectMember;
  editable: boolean;
}

export default function ProjectMemberItem({member, editable}: ProjectMemberItemProps) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {removeMember} = useContext(ProjectMemberContext);

  const handleRemoveMember = () => {
    removeMember?.(member.userId).then(() => {
      setShowConfirmation(false);
    }, () => {});
  };

  return (
    <ListItem
      secondaryAction={editable && (!showConfirmation ? (
          <IconButton
            edge="end"
            onClick={() => setShowConfirmation(true)}
          >
            <DeleteIcon/>
          </IconButton>
        ) : (
          <Stack direction="row">
            <IconButton
              edge="end"
              onClick={handleRemoveMember}
            >
              <CheckIcon/>
            </IconButton>
            <IconButton
              edge="end"
              onClick={() => setShowConfirmation(false)}
            >
              <CloseIcon/>
            </IconButton>
          </Stack>
        )
      )}
    >
      <ListItemAvatar>
        <Avatar sx={{bgcolor: stringToColor(member.username)}}>{avatarInitials(member.username)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={member.username}
        secondary={member.role}
      />
    </ListItem>
  )
}