import {Project} from "../../services/ProjectService";
import {Button, Card, CardActionArea, CardActions, CardContent, CardHeader} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useNavigate} from "react-router-dom";

interface ProjectCardProps {
  project: Project;
  editable?: boolean;
  isOwner?: boolean;
}

export default function ProjectCard({project, editable = false, isOwner = false}: ProjectCardProps) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <Card sx={{':hover': {
        boxShadow: 6, // theme.shadows[20]
      },}}>
      <CardActionArea onClick={handleCardClick}>
        <CardHeader
          title={project.name}
          subheader={`Lead: ${isOwner ? 'You' : project.lead}`}
        />
        <CardContent>
          <Typography variant="body2" sx={{color: 'text.secondary'}}>
            {project.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      {editable && (
        <CardActions>
          <Button size="small">Edit</Button>
          <Button size="small">Delete</Button>
        </CardActions>
      )}
    </Card>
  );
}