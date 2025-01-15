import {useParams} from "react-router-dom";
import ProjectMemberProvider from "../components/project-members/ProjectMemberProvider";
import Box from "@mui/material/Box";
import ProjectMembersView from "../components/project-members/ProjectMembersView";
import {useContext} from "react";
import {ProjectContext} from "../components/projects/ProjectProvider";
import IssueColumn from "../components/issues/IssueColumn";
import {Stack} from "@mui/material";
import IssueProvider from "../components/issues/IssueProvider";
import CurrentProjectProvider from "../components/projects/CurrentProjectProvider";

export const DraggableTypes = {
  ISSUE: "IssueCard"
}

export default function ProjectPage() {
  const {projectId} = useParams();
  const {projects} = useContext(ProjectContext);

  const parsedProjectId = parseInt(projectId ?? '0', 10);
  const project = projects?.find(project => project.id === parsedProjectId);


  return (
    <ProjectMemberProvider projectId={parsedProjectId}>
      <CurrentProjectProvider project={project}>
        <IssueProvider projectId={parsedProjectId}>
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <Box sx={{width: '85%'}}>
              <ProjectMembersView project={project} />
              <Stack direction="row" justifyContent="space-evenly" justifyItems="stretch" spacing={10} sx={{marginTop: "20px"}}>
              { project &&
                <>
                  <IssueColumn status="TODO" project={project}/>
                  <IssueColumn status="DOING" project={project}/>
                  <IssueColumn status="DONE" project={project}/>
                </>
              }
              </Stack>
            </Box>
          </Box>
        </IssueProvider>
      </CurrentProjectProvider>
    </ProjectMemberProvider>
  );
}