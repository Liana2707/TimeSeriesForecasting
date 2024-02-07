import { addStyles as addMathquillStyles } from 'react-mathquill';
import MathQuill from 'react-mathquill';
import React, { useState, useRef } from 'react';
import { Button } from '@mui/material';
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import './GenerateForm.css'

addMathquillStyles();

const GenerateForm = ({ onFormSubmit }) => {

  const [formData, setFormData] = useState({
    timeInterval: 'Count',
    model: 'random',
    motion: '',
    noise: 'random',
    count: '20'
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


  const mathquillModelRef = useRef(null);
  const handleInputModelChange = () => {
    const mathField = mathquillModelRef.current;
    if (mathField) {
      const newLatex = mathField.latex();
      setFormData((prevData) => ({
        ...prevData,
        model: newLatex,
      }));
    }
  };

  const mathquillMotionRef = useRef(null);
  const handleInputMotionChange = () => {
    const mathField = mathquillMotionRef.current;
    if (mathField) {
      const newLatex = mathField.latex();
      setFormData((prevData) => ({
        ...prevData,
        motion: newLatex,
      }));
    }
  };

  const mathquillNoiseRef = useRef(null);
  const handleInputNoiseChange = () => {
    const mathField = mathquillNoiseRef.current;
    if (mathField) {
      const newLatex = mathField.latex();
      setFormData((prevData) => ({
        ...prevData,
        noise: newLatex,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFormSubmit(formData);
    setFormData({
      timeInterval: 'Count',
      model: 'random',
      motion: '',
      noise: 'random',
      count: '20'
    })
  };
  const text1 = "You should use x_0, ..., x_100; x_{t-100}, ..., x_{t+100} for time series model." 
  const text2 = "You should use e_0, ..., e_100; e_{t-100}, ..., e_{t+100} for noise model"
  const text3 = "You should use z_0, ..., z_100; z_{t-100}, ..., z_{t+100} for motion model"
  return (
    <form className='form' onSubmit={handleSubmit}>
      <div className='alert'>
        В формулах для верной интерпритации вводите сначала нижние индексы, а затем верхние 
      </div>
      <h3>Series characteristics</h3>
      <h4>Time Interval</h4>
      <Box className='field'
        sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <InputLabel>Time Interval</InputLabel>
          <Select
            name='timeInterval'
            value={formData.timeInterval}
            label="Time Interval"
            onChange={handleChange}
            >
            <MenuItem name='timeInterval' value='Day'>Day</MenuItem>
            <MenuItem name='timeInterval' value='Count'>Count</MenuItem>
            <MenuItem name='timeInterval' value='Hour'>Hour</MenuItem>
            <MenuItem name='timeInterval' value='Minute'>Minute</MenuItem>
            <MenuItem name='timeInterval' value='Second'>Second</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <h4>Count of measurements</h4>
      <TextField
        className='field'
        label="Count"
        variant="filled"
        name='count'
        value={formData.count}
        onChange={handleChange}
        />

      <h4>Model</h4>
      <div className='alert'>{text1}</div>
      <MathQuill
        onChange={handleInputModelChange}
        mathquillDidMount={(mathField) => {
          mathquillModelRef.current = mathField;
        }}
      />

      <h4>Motion model</h4>
      <div className='alert'>{text3}</div>
      <MathQuill
        onChange={handleInputMotionChange}
        mathquillDidMount={(mathField) => {
          mathquillMotionRef.current = mathField;
        }}
      />

      <h3>Noise characteristics</h3>
      <h4>Noise model</h4>
      <div className='alert'>{text2}</div>
      <MathQuill
        onChange={handleInputNoiseChange}
        mathquillDidMount={(mathField) => {
          mathquillNoiseRef.current = mathField;
        }}
      />

      <Button className='submit-button' type="submit">Submit</Button>
    </form>
  );
};

export default GenerateForm
