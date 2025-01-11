import {useParams} from "react-router-dom";
import ProjectMemberProvider from "../components/project-members/ProjectMemberProvider";

export default function ProjectPage() {
  const {projectId} = useParams();
  const parsedProjectId = parseInt(projectId ?? '0', 10);

  return (
    <ProjectMemberProvider projectId={parsedProjectId}>
      <div>
        <h1>Project</h1>
      </div>
    </ProjectMemberProvider>
  );
}