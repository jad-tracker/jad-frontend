import {useParams} from "react-router-dom";
import ProjectMemberProvider from "../components/project-members/ProjectMemberProvider";
import Box from "@mui/material/Box";
import ProjectMembersView from "../components/project-members/ProjectMembersView";
import {useContext, useEffect, useRef, useState} from "react";
import {ProjectContext} from "../components/projects/ProjectProvider";
import IssueColumn from "../components/issues/IssueColumn";
import {Stack} from "@mui/material";
import {Issue} from "../services/IssueService";
import {issueService} from "../services/IssueService";
import useAuth from "../hooks/auth/useAuth";

export const DraggableTypes = {
  ISSUE: "IssueCard"
}

export default function ProjectPage() {
  const {projectId} = useParams();
  const {projects} = useContext(ProjectContext);

  const parsedProjectId = parseInt(projectId ?? '0', 10);
  const project = projects?.find(project => project.id === parsedProjectId);

  const {token} = useAuth();

  const [issues, setIssues] = useState<Issue[]>([]);
  const issuesRef = useRef<Issue[]>([]);
  issuesRef.current = issues;



  const handleIssueUpdate = (updatedIssue: Issue) => {
    issueService.updateIssue(project!, updatedIssue.id!, updatedIssue.summary, updatedIssue.description,
      updatedIssue.type, updatedIssue.status, updatedIssue.date, updatedIssue.assignee, token)
      .then(savedIssue => {
        const arr = issuesRef.current.map(issue => {
          if (issue.id == savedIssue.id) {
            return updatedIssue;
          } else {
            return issue;
          }
        });
        setIssues(arr);
      });
  }

  const handleIssueAdd = (issue: Issue) => {
    issueService.createIssue(project!, issue.summary, issue.description, issue.type, issue.status,
      issue.date, issue.assignee, token)
    .then(savedIssue => {
      const arr = [...issuesRef.current, savedIssue]
      setIssues(arr);
    });
  }

  useEffect(() => {
    if (project == undefined) return;
    issueService.getIssuesForProject(project, token)
      .then(values => {
        setIssues(values)
      });
  }, [project])

  return (
    <ProjectMemberProvider projectId={parsedProjectId}>
      <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Box sx={{width: '85%'}}>
          <ProjectMembersView project={project} />
          <Stack direction="row" justifyContent="space-evenly" justifyItems="stretch" spacing={10} sx={{marginTop: "20px"}}>
          { project &&
            <>
              <IssueColumn title="To Do" issues={issues} statusKey="TODO" setAllIssues={setIssues} handleIssueUpdate={handleIssueUpdate} handleIssueAdd={handleIssueAdd} project={project}/>
              <IssueColumn title="In Progress" issues={issues} statusKey="DOING" setAllIssues={setIssues} handleIssueUpdate={handleIssueUpdate} handleIssueAdd={handleIssueAdd} project={project}/>
              <IssueColumn title="Done" issues={issues} statusKey="DONE" setAllIssues={setIssues} handleIssueUpdate={handleIssueUpdate} handleIssueAdd={handleIssueAdd} project={project}/>
            </>
          }
          </Stack>
        </Box>
      </Box>
    </ProjectMemberProvider>
  );
}