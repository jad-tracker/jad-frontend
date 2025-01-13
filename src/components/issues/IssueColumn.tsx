import {Issue} from "../../services/ProjectService";
import {Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {useDrop} from "react-dnd";
import IssueCard from "./IssueCard";
import React, {useEffect, useRef, useState} from "react";
import {DraggableTypes} from "../../pages/ProjectPage";

interface IssueColumnProps {
  issues: Issue[],
  statusKey: string,
  title: string,
  setAllIssues: React.Dispatch<React.SetStateAction<Issue[]>>
}


export default function IssueColumn({issues, statusKey, title, setAllIssues}: IssueColumnProps) {
  const [ownIssues, setOwnIssues] = useState<Issue[]>([]);
  const issuesRef = useRef<Issue[]>([]);
  issuesRef.current = issues;

  useEffect(() => {
    const filtered = issues.filter(item => item.status == statusKey);
    setOwnIssues(filtered);
  }, [issues])

  const handleDrop = (droppedIssue: Issue) => {
    console.log(`Issue ${droppedIssue.id} dropped in column ${statusKey}`);
    console.log(ownIssues);
    const arr = issuesRef.current.map(issue => {
      if (issue.id == droppedIssue.id) {
        return ({
          ...issue,
          "status": statusKey
        });
      } else {
        return issue;
      }
    });
    setAllIssues(arr);
  }

  const [{isDndOver}, drop] = useDrop(
    () => ({
        accept: DraggableTypes.ISSUE,
        drop: (issue: Issue) => handleDrop(issue),
        collect: monitor => ({
          // Show a IssueCard skeleton if the user is dragging an IssueCard over this column
          isDndOver: monitor.isOver()
        })
      }
    ), []
  )



  return (
    <Stack sx={{backgroundColor: "#F7F8F9", borderRadius: "5px", paddingTop: "10px"}}>
      <Typography sx={{
        marginLeft: "20px",
        textTransform: "uppercase",
        color: "#626F86",
        fontSize: 12
      }}>{`${title} ${ownIssues.length}`}</Typography>
      <Stack sx={{minWidth: "300px", maxWidth: "600px", minHeight: "500px", marginTop: "10px"}} ref={drop}>
        {ownIssues.map(issue => (
          <IssueCard issue={issue} key={issue.id}/>
        ))}
      </Stack>
    </Stack>
  );
}
