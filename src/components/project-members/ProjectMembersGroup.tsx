import {ProjectMember} from "../../services/ProjectService";
import {Avatar, AvatarGroup, Box, Fab, Tooltip} from "@mui/material";
import {avatarInitials, stringToColor} from "../../utils/AvatarUtils";
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import {useState} from "react";
import ProjectMembersDialog from "./ProjectMembersDialog";
import useAuth from "../../hooks/auth/useAuth";

interface ProjectMembersGroupProps {
  lead: string;
  members: ProjectMember[];
  maxNumberOfMembers?: number;
}

export default function ProjectMembersGroup({lead, members, maxNumberOfMembers = 3}: ProjectMembersGroupProps) {
  const [isProjectMembersDialogOpen, setProjectMembersDialogOpen] = useState(false);
  const {username} = useAuth();

  const maxAvatarCount = Math.min(maxNumberOfMembers + 1, members.length + 2);
  const extraPlaceholderAvatars = Math.max(0, maxAvatarCount - members.length);
  const editable = username == lead;

  const handleManageProjectMembers = () => {
    console.log('Manage project members');
    setProjectMembersDialogOpen(true);
  }

  const handleProjectMembersDialogClose = () => {
    setProjectMembersDialogOpen(false);
  }

  return (
    <Box>
      <AvatarGroup
        sx={{zIndex: 0}}
        max={maxAvatarCount}
        renderSurplus={(_) => (
          <Tooltip title="Manage members">
            <Fab
              size="large"
              sx={{
                zIndex: 1,
                ':hover': {
                  zIndex: 3
                },
              }}
              onClick={handleManageProjectMembers}
            >
              <ManageAccountsIcon/>
            </Fab>
          </Tooltip>
        )}
      >
        <Tooltip title={`${lead} (Lead)`}>
          <Avatar
            sx={{
              bgcolor: stringToColor(lead),
              zIndex: 2,
              ':hover': {
                zIndex: 3
              },
            }}
          >
            {avatarInitials(lead)}
          </Avatar>
        </Tooltip>
        {members.slice(0, maxAvatarCount).map(member => (
          <Tooltip
            key={member.userId}
            title={`${member.username} (${member.role})`}
          >
            <Avatar
              sx={{
                bgcolor: stringToColor(member.username),
                zIndex: 2,
                ':hover': {
                  zIndex: 3
                },
              }}
            >
              {avatarInitials(member.username)}
            </Avatar>
          </Tooltip>
        ))}
        {Array.from({length: extraPlaceholderAvatars}).map((_, index) => (
          <Avatar key={index} sx={{zIndex: 2}}/>
        ))}
      </AvatarGroup>
      {isProjectMembersDialogOpen && (
        <ProjectMembersDialog
          open={isProjectMembersDialogOpen}
          onClose={handleProjectMembersDialogClose}
          lead={lead}
          members={members}
          editable={editable}
        />
      )}
    </Box>
  )
}