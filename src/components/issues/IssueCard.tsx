import {Card, CardContent, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Issue} from "../../services/ProjectService";
import {useDrag} from "react-dnd";
import {DraggableTypes} from "../../pages/ProjectPage";


export default function IssueCard({issue}: {issue: Issue}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: DraggableTypes.ISSUE,
    item: issue,
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }))

  return (
    <Card sx={{margin: "5px 16px", opacity: isDragging ? 0.3 : 1.0, cursor: "move"}} ref={drag}>
      <CardContent>
        <Stack sx={{justifyContent: "space-between", minHeight: "100px"}}>
          <Typography sx={{fontSize: 16}}>{issue.summary} {issue.id}</Typography>
          <Typography sx={{fontSize: 12, alignSelf: "end"}}>{issue.assignee}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}