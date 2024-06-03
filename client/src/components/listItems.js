import * as React from 'react';
import { Link } from 'react-router-dom';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Button from '@mui/material/Button';

import BarChartIcon from '@mui/icons-material/BarChart';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';

import handleFileSelect from '../requests/FileSelect';
import FileUpload from './FileUpload'


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
        to='/'>
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
      <ListItemText>
        <ListItemIcon>
          <UploadFileIcon />
        </ListItemIcon>
        <FileUpload onFileSelect={handleFileSelect} />
      </ListItemText>
    </ListItemButton>

    <ListItemButton>
      <Link to='/generate'>
        <ListItemIcon>
          <FiberNewIcon />
        </ListItemIcon>
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
