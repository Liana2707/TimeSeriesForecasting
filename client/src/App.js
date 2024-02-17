import React from 'react';
import { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Dashbord from './pages/dashbord';
import Reports from './pages/reports';

import { teal, red } from '@mui/material/colors';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import GenerateForm from './components/GenerateForm/GenerateForm';
import { mainListItems, secondaryListItems } from './components/listItems';
import AppBar from './components/AppBar';
import Drawer from './components/Drawer';

import handleFormSubmit from './requests/FormSubmit';


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: teal,
    secondary: red,
  },
  typography: {
    fontSize: 20,
  },
});

export default function App() {

  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [reports, setReports] = useState([
    {
      title: 'Test Uploading',
      id: '1',
      description: 'Uploading',
      timeInterval: 'Count',
      model: 'undefined',
      motion: 'undefined',
      noise: 'undefined',
      count: '20'
    },
    {
      title: 'Test Generating',
      id: '2',
      description: 'Generating',
      model: 'undefined',
      motion: 'undefined',
      noise: 'undefined',
      count: '20',
    },
  ]);

  const createReport = (newReport) => {
    setReports([...reports, newReport])
  }

  const deleteAllReports = () => {
    setReports([])
  }

  const deleteReport = (report) => {
    setReports(reports.filter(r => r.id !== report.id))
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={open}>
            <Toolbar sx={{ pr: '24px' }}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(open && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                sx={{ flexGrow: 1 }}
              >
                Time Series Forecasting
              </Typography>

            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {mainListItems}
              <Divider sx={{ my: 1 }} />
              {secondaryListItems}
            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
              theme.palette.mode === theme.palette.grey[900],
              flexGrow: 1,
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="dashboard" element={<Dashbord />} />
              <Route path="reports" element={<Reports deleteReports={deleteAllReports} reports={reports} deleteOneReport={deleteReport} />} />
              <Route path='generate' element={<GenerateForm create={createReport} onFormSubmit={handleFormSubmit}/>} />
            </Routes>
          </Box>
        </Box>
      </BrowserRouter>
    </ThemeProvider>
  )
}

