import React from "react"
import PropTypes from 'prop-types';
import ReportItem from "../components/ReportItem"
import MainFeaturedPost from "../components/MainFeaturedPost";
import { Grid, Button } from "@mui/material";

const Reports = ({ reports, deleteReports, deleteOneReport }) => {
  const mainFeaturedPost = {
    title: 'Файлы',
    description:
      "На этой странице вы можете просмотреть загруженные файлы",
    imageText: 'main image description',
  };
  const buttons = [
    <Button key={0} onClick={deleteReports}>Удалить все файлы</Button>
  ]

  return (
    <div>
      <MainFeaturedPost post={mainFeaturedPost} buttons={buttons}/>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Grid container spacing={8} xs={8} item={true}>
          {reports.map(report =>
            <ReportItem key={report.id} deleteReport={deleteOneReport} report={report}/>
          )}
        </Grid>
      </div>
    </div>
  )
}

ReportItem.propTypes = {
  report: PropTypes.shape({
    description: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default Reports