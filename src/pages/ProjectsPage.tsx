import {useContext} from "react";
import {ProjectContext} from "../components/projects/ProjectProvider";
import ProjectsGrid from "../components/projects/ProjectsGrid";
import {Button, Divider} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useAuth from "../hooks/auth/useAuth";
import ErrorSnackbar from "../components/core/ErrorSnackbar";
import LoadingProjectsGrid from "../components/projects/LoadingProjectsGrid";

export default function ProjectsPage() {
  const {projects, loading, loadingError} = useContext(ProjectContext);
  const {username} = useAuth();

  const ownedProjects = projects?.filter(project => project.lead === username)
  const otherProjects = projects?.filter(project => project.lead !== username)

  return (
    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
      <Grid container spacing={2} sx={{width: '85%'}}>
        <Grid size={6}>
          <Box sx={{p: 2}}>
            <Box sx={{display: 'flex', alignItems: 'center', pb: 1}}>
              <Typography variant="h5" gutterBottom sx={{flexGrow: 1}}>
                Your projects
              </Typography>
              <Button>
                Create new project
              </Button>
            </Box>
            <Divider sx={{mb: 2}}/>
            {ownedProjects && ownedProjects.length > 0 ? (
              <ProjectsGrid projects={ownedProjects} editable isOwner />
            ) : (
              <Box>
                {loading ? (
                  <LoadingProjectsGrid editable />
                ) : (
                  <Typography sx={{p: 1}} variant="body2">
                    No projects found
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Grid>
        <Grid size={6}>
          <Box sx={{p: 2}}>
            <Box sx={{pb: 1}}>
              <Typography variant="h5" gutterBottom>
                Other projects
              </Typography>
            </Box>
            <Divider sx={{mb: 2}}/>
            {otherProjects && otherProjects.length > 0 ? (
              <ProjectsGrid projects={otherProjects} />
            ) : (
              <Box>
                {loading ? (
                  <LoadingProjectsGrid />
                ) : (
                  <Typography sx={{p: 1}} variant="body2">
                    No projects found
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      {loadingError && (
        <ErrorSnackbar error={loadingError} />
      )}
    </Box>
  );
}