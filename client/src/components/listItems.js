import * as React from 'react';
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BarChartIcon from '@mui/icons-material/BarChart';

import ListSubheader from '@mui/material/ListSubheader';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

import FileUpload from './FileUpload'
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const handleFileSelect = (file) => {
  const formData = new FormData();
  formData.append('file', file);

  fetch('/upload', {
     method: 'POST',
     body: formData,
  })
  .then(response => response.json())
  .then(data => {
     console.log('Сервер ответил:', data);
  })
  .catch(error => {
     console.error('Ошибка:', error);
  });

}


export const mainListItems = (
  <React.Fragment>
    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <Link style={{
        textDecoration: "none",
        color: "inherit"
      }}
        to='/reports'>
        <ListItemText primary="Reports" />
      </Link>
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      New forecasting
    </ListSubheader>

    <ListItemButton>
      <ListItemIcon>
        <UploadFileIcon />
      </ListItemIcon>
      <ListItemText>
          <FileUpload onFileSelect={handleFileSelect}/>
      </ListItemText>
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <FiberNewIcon />
      </ListItemIcon>
      <Link to='/generate'>
        <Button component="label" variant="text">
          <ListItemText primary="Generate" />
        </Button>
      </Link>
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <ConnectWithoutContactIcon />
      </ListItemIcon>
      <Button component="label" variant="text">
        <ListItemText primary="Connect" />
      </Button>
    </ListItemButton>

  </React.Fragment>
);
