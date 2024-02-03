import React, { useState } from 'react';
import katex from "katex";
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import './GenerateForm.css'

const intervals = ['Day', 'Count', 'Hour', 'Minute', 'Second']

const GenerateForm = ({ onFormSubmit }) => {

  const [formData, setFormData] = useState({
    timeInterval: 'Count',
    model: 'random',
    motion: 'without',
    noise: 'random'
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
  };


  const options = {
    throwOnError: false,
    strict: false,
    displayMode: true
  };

  const preview1 = formData.noise ? katex.renderToString(formData.noise, options) : '';
  const preview2 = formData.model ? katex.renderToString(formData.model, options) : '';
  const preview3 = formData.motion ? katex.renderToString(formData.motion, options) : '';


  const [time, setTime] = React.useState('Count');
  const handleTime = (event) => {
    setTime(event.target.value);
    handleChange(event)
  };

  return (
    <form className='form' onSubmit={handleSubmit}>
      <h3>Series characteristics</h3>
      <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel>Time Interval</InputLabel>
        <Select
          className='field'
          name='timeInterval'
          value={time}
          label="Time Interval"
          onChange={handleTime}
        >
          <MenuItem name='timeInterval' value='Day'>Day</MenuItem>
          <MenuItem name='timeInterval' value='Count'>Count</MenuItem>
          <MenuItem name='timeInterval' value='Hour'>Hour</MenuItem>
          <MenuItem name='timeInterval' value='Minute'>Minute</MenuItem>
          <MenuItem name='timeInterval' value='Second'>Second</MenuItem>
        </Select>
      </FormControl>
      </Box>



      <TextField
        className='field'
        id="filled-hidden-label-normal"
        label="Model measurements"
        defaultValue="Enter in LaTeX"
        variant="filled"
        name='model'
        value={formData.model}
        onChange={handleChange}
        helperText='If you want random[0,1], enter "random"'
      />

      <div dangerouslySetInnerHTML={{ __html: preview2 }} />


      <TextField
        className='field'
        label="Motion measurements"
        defaultValue="Enter in LaTeX"
        variant="filled"
        name='motion'
        value={formData.motion}
        onChange={handleChange}
        helperText='Default without motion'
      />

      <div dangerouslySetInnerHTML={{ __html: preview3 }} />

      <h3>Noise characteristics</h3>
      <TextField
        className='field'
        id="filled-hidden-label-normal"
        label="Noise model for feature"
        defaultValue="Enter in LaTeX"
        variant="filled"
        name='noise'
        value={formData.noise}
        onChange={handleChange}
        helperText='If you want random noise, enter "random"'
      />

      <div dangerouslySetInnerHTML={{ __html: preview1 }} />
      <Button className='submit-button' type="submit">Submit</Button>
    </form>
  );
};

export default GenerateForm;