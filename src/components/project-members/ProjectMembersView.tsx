import {Project} from "../../services/ProjectService";
import {CircularProgress, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {useContext} from "react";
import {ProjectMemberContext} from "./ProjectMemberProvider";
import ProjectMembersGroup from "./ProjectMembersGroup";
import ErrorSnackbar from "../core/ErrorSnackbar";

interface ProjectMembersOverviewProps {
  project?: Project;
}

export default function ProjectMembersView({project}: ProjectMembersOverviewProps) {
  const {members, loading, loadingError} = useContext(ProjectMemberContext);

  return (
    <Box>
      {project && (
        <Stack spacing={1}>
          <Stack direction="row" spacing={2} sx={{alignItems: 'center'}}>
            <Typography variant="h4">
              {project.name}
            </Typography>
            {members !== undefined ? (
              <ProjectMembersGroup lead={project.lead} members={members} />
            ) : (loading && (
              <CircularProgress />
            ))}
          </Stack>
          <Typography variant="body1" sx={{pb: 1}}>
            {project.description}
          </Typography>
        </Stack>
      )}
      {loadingError && (
        <ErrorSnackbar error={loadingError} />
      )}
    </Box>
  );
}