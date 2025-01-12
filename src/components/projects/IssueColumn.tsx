import {Issue, Project} from "../../services/ProjectService";
import ProjectCard from "./ProjectCard";
import {Card, CardContent, CardHeader, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";

interface IssueColumnProps {
  issues: Issue[],
  count: number,
  title: string,
}


export default function IssueColumn({issues, count, title}: IssueColumnProps) {
  return (
    <Stack sx={{backgroundColor: "#F7F8F9", borderRadius: "5px", paddingTop: "10px"}}>
      <Typography sx={{marginLeft: "20px", textTransform: "uppercase", color: "#626F86", fontSize: 12}}>{`${title} ${count}`}</Typography>
      <Stack sx={{minWidth: "300px", maxWidth: "600px", minHeight: "500px", marginTop: "10px"}}>
        {/*{issues.map(issue => (*/}
        {Array(count).fill(true).map(() =>
            <Card sx={{margin: "5px 16px"}}>
              <CardContent>
                <Stack sx={{justifyContent: "space-between", minHeight: "100px"}}>
                  <Typography sx={{fontSize: 16}}>Some sort of project</Typography>
                  <Typography sx={{fontSize: 12, alignSelf: "end"}}>An Assignee</Typography>
                </Stack>
              </CardContent>
            </Card>
          )
        }
        {/*))}*/}
      </Stack>
    </Stack>
  );
}
