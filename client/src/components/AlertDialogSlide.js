import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';


import RadioGroup from '@mui/material/RadioGroup';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import GenerateForm from './GenerateForm/GenerateForm';

function AlertDialogSlide() {
    const [open, setOpen] = React.useState(false);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleFormSubmit = async (formData) => {
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const result = await response.json();
        console.log('Server response:', result);
        handleClose()
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };
  
    return (
      <div>
        <Button onClick={handleClickOpen} component="label" variant="text">
          New data
        </Button>
        <Dialog  maxWidth="xl" 
          open={open}
          onClose={handleClose}
        >
          <DialogContent>
            <GenerateForm onFormSubmit={handleFormSubmit}/>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  export default AlertDialogSlide