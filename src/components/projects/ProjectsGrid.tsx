import {Project} from "../../services/ProjectService";
import Grid from "@mui/material/Grid2";
import ProjectCard from "./ProjectCard";

interface ProjectsGridProps {
  projects: Project[];
  editable?: boolean;
  isOwner?: boolean;
}

export default function ProjectsGrid({projects, editable = false, isOwner = false}: ProjectsGridProps) {
  return (
    <Grid container spacing={2}>
      {projects.map(project => (
        <Grid size={4} key={project.id}>
          <ProjectCard project={project} editable={editable} isOwner={isOwner} />
        </Grid>
      ))}
    </Grid>
  );
}