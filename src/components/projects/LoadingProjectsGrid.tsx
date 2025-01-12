import {Card, CardActions, CardContent, CardHeader, Skeleton} from "@mui/material";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";

interface LoadingProjectsGridProps {
  numberOfProjects?: number;
  editable?: boolean;
}

export default function LoadingProjectsGrid({numberOfProjects = 3, editable = false}: LoadingProjectsGridProps) {
  return (
    <Grid container spacing={2}>
      {Array.from({length: numberOfProjects}).map((_, index) => (
        <Grid size={4} key={index}>
          <Card sx={{height: '100%'}}>
            <CardHeader
              title={<Skeleton />}
              subheader={<Skeleton />}
            />
            <CardContent>
              <Typography variant="body2" sx={{color: 'text.secondary'}}>
                <Skeleton />
              </Typography>
            </CardContent>
            {editable && (
              <CardActions>
                <Skeleton variant="rectangular" width={50} height={20} />
                <Skeleton variant="rectangular" width={50} height={20} />
              </CardActions>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}