import React from "react";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import img from '../images/chart.jpg'
import { Button } from "@mui/material";

const ReportItem = ({report, deleteReport}) => {
  const imageLabel = 'Image Text'
    return(
        <Grid item xs={12}>
        <CardActionArea component="a" href="#">
          <Card sx={{ display: 'flex' }}>
            <CardContent sx={{ flex: 1 }}>
              <Typography component="h2" variant="h5">
                {report.title}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {report.id}
              </Typography>
              <Typography variant="subtitle1" paragraph>
                {report.description}
              </Typography>
              <Button onClick={() => deleteReport(report)}>
                Delete
              </Button>
            </CardContent>
            <CardMedia
              component="img"
              sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
              image={img}
              alt={imageLabel}
            />
          </Card>
        </CardActionArea>
      </Grid>
    )
}

export default ReportItem