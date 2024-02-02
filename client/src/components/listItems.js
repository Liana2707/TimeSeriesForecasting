import * as React from 'react';
import AlertDialogSlide from './AlertDialogSlide';
import { styled } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import BarChartIcon from '@mui/icons-material/BarChart';

import ListSubheader from '@mui/material/ListSubheader';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import ConnectWithoutContactIcon from '@mui/icons-material/ConnectWithoutContact';


import Button from '@mui/material/Button';

const VisuallyHiddenInput = styled('input')({
  clipPath: 'inset(50%)',
  width: 1,
});


export const mainListItems = (
  <React.Fragment>

    <ListItemButton>
      <ListItemIcon>
        <BarChartIcon />
      </ListItemIcon>
      <ListItemText primary="Reports" />
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
        <Button component="label" variant="text">
          Upload data
          <VisuallyHiddenInput type="file" />
        </Button>
      </ListItemText>
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <FiberNewIcon />
      </ListItemIcon>
      <AlertDialogSlide />
    </ListItemButton>

    <ListItemButton>
      <ListItemIcon>
        <ConnectWithoutContactIcon />
      </ListItemIcon>
      <ListItemText primary="Connect" />
    </ListItemButton>

  </React.Fragment>
);
