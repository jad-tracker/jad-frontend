import {Project} from "../../services/ProjectService";
import {Button, Card, CardActionArea, CardActions, CardContent, CardHeader, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";
import {useContext, useState} from "react";
import RenameProjectDialog from "./RenameProjectDialog";
import {ProjectContext} from "./ProjectProvider";
import ErrorSnackbar from "../core/ErrorSnackbar";

interface ProjectCardProps {
  project: Project;
  editable?: boolean;
  isOwner?: boolean;
}

export default function ProjectCard({project, editable = false, isOwner = false}: ProjectCardProps) {
  const [isRenameProjectDialogOpen, setRenameProjectDialogOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const {deleteProject, deleteError} = useContext(ProjectContext);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  const handleRenameProject = () => {
    setRenameProjectDialogOpen(true);
  };

  const handleRenameProjectDialogClose = () => {
    setRenameProjectDialogOpen(false);
  };

  const handleDeleteProject = () => {
    deleteProject?.(project.id).then(() => {
      setShowConfirmation(false);
    }, () => {});
  };

  return (
    <Card sx={{
        ':hover': {
          boxShadow: 6,
        },
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <CardHeader
          title={project.name}
          subheader={`Managed by ${isOwner ? 'You' : project.lead}`}
        />
        <CardContent>
          <Typography variant="body2" sx={{color: 'text.secondary'}}>
            {project.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      {editable && (
        <CardActions>
          {!showConfirmation ? (
            <Stack direction="row">
              <Button size="small" onClick={handleRenameProject}>
                Rename
              </Button>
              <Button size="small" onClick={() => setShowConfirmation(true)}>
                Delete
              </Button>
            </Stack>
          ) : (
            <Stack direction="row">
              <Button size="small" onClick={handleDeleteProject}>
                Confirm
              </Button>
              <Button size="small" onClick={() => setShowConfirmation(false)}>
                Cancel
              </Button>
            </Stack>
          )}
        </CardActions>
      )}
      {isRenameProjectDialogOpen && (
        <RenameProjectDialog
          open={isRenameProjectDialogOpen}
          onClose={handleRenameProjectDialogClose}
          project={project}
        />
      )}
      {deleteError && (
        <ErrorSnackbar error={deleteError} />
      )}
    </Card>
  );
}