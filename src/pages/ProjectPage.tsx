import {useParams} from "react-router-dom";
import ProjectMemberProvider from "../components/project-members/ProjectMemberProvider";
import Box from "@mui/material/Box";
import ProjectMembersView from "../components/project-members/ProjectMembersView";
import {useContext} from "react";
import {ProjectContext} from "../components/projects/ProjectProvider";

export default function ProjectPage() {
  const {projectId} = useParams();
  const {projects} = useContext(ProjectContext);

  const parsedProjectId = parseInt(projectId ?? '0', 10);
  const project = projects?.find(project => project.id === parsedProjectId);

  return (
    <ProjectMemberProvider projectId={parsedProjectId}>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{width: '85%'}}>
          <ProjectMembersView project={project} />
        </Box>
      </Box>
    </ProjectMemberProvider>
  );
}