import {useParams} from "react-router-dom";
import ProjectMemberProvider from "../components/project-members/ProjectMemberProvider";
import Box from "@mui/material/Box";
import ProjectMembersView from "../components/project-members/ProjectMembersView";
import {useContext, useEffect, useState} from "react";
import {ProjectContext} from "../components/projects/ProjectProvider";
import IssueColumn from "../components/issues/IssueColumn";
import {Stack} from "@mui/material";
import {Issue} from "../services/ProjectService";

export const DraggableTypes = {
  ISSUE: "IssueCard"
}

export default function ProjectPage() {
  const {projectId} = useParams();
  const {projects} = useContext(ProjectContext);

  const parsedProjectId = parseInt(projectId ?? '0', 10);
  const project = projects?.find(project => project.id === parsedProjectId);


  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const arr = [];
    for (let i = 1; i < 10; i++) {
      const mod = i % 3;
      let status = "";
      if (mod == 0) {
        status = "TODO";
      } else if (mod == 1) {
        status = "DOING";
      } else {
        status = "DONE";
      }
      const issue: Issue = {
        id: i,
        summary: "Issue",
        description: "Thing doesn't work qwq\nFind out why UwU",
        type: "TASK",
        status: status,
        date: "2015-11-11 10:05",
        assignee: "maria",
      }
      arr.push(issue);
    }
    setIssues(arr);
  }, [])

  return (
    <ProjectMemberProvider projectId={parsedProjectId}>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{width: '85%'}}>
          <ProjectMembersView project={project} />
          <Stack direction="row" justifyContent="space-evenly" justifyItems="stretch" spacing={10} sx={{marginTop: "20px"}}>
            <IssueColumn title="To Do" issues={issues} statusKey="TODO" setAllIssues={setIssues}/>
            <IssueColumn title="In Progress" issues={issues} statusKey="DOING" setAllIssues={setIssues}/>
            <IssueColumn title="Done" issues={issues} statusKey="DONE" setAllIssues={setIssues}/>
          </Stack>
        </Box>
      </Box>
    </ProjectMemberProvider>
  );
}