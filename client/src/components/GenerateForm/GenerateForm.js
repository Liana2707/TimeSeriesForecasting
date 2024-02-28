import { addStyles as addMathquillStyles } from 'react-mathquill';
import MathQuill from 'react-mathquill';
import React, { useState, useRef } from 'react';
import { Button, Grid } from '@mui/material';
import { TextField } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import MainFeaturedPost from '../MainFeaturedPost';
import './GenerateForm.css'

addMathquillStyles();

const GenerateForm = ({ onFormSubmit, create }) => {
  const mainFeaturedPost = {
    title: 'Genereting data',
    description:
      "На данной странице Вы можете сгенерировать временной ряд. В формулах для верной интерпритации вводите сначала нижние индексы, а затем верхние. Предполагается, что для обозначения переменных модели используются переменные x_0, ..., x_100; x_{t-100}, ..., x_{t+100}, для обозначения переменных шума e_0, ..., e_100; e_{t-100}, ..., e_{t+100}.",
    imageText: 'main image description',
  };
  const buttons = []
  const [formData, setFormData] = useState({
    timeInterval: 'Count',
    model: 'undefined',
    motion: 'undefined',
    noise: 'undefined',
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
    const newReport = {
      ...formData, id: Date.now(), title: 'Generating', description: 'generating'
    }
    onFormSubmit(formData, newReport, create);
    setFormData({
      timeInterval: 'Count',
      model: 'undefined',
      motion: 'undefined',
      noise: 'undefined',
      count: '20'
    })
  };
  return (
    <div>

      <MainFeaturedPost post={mainFeaturedPost} buttons={buttons} />
      <div className='form-container'>
        <Grid container xs={8}>

          <form className='form' onSubmit={handleSubmit}>
            <div className='alert'>
            </div>
            <h2 className='form-title'>Series characteristics</h2>
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
            <MathQuill
              onChange={handleInputModelChange}
              mathquillDidMount={(mathField) => {
                mathquillModelRef.current = mathField;
              }}
            />

            <h4>Motion model</h4>
            <MathQuill
              onChange={handleInputMotionChange}
              mathquillDidMount={(mathField) => {
                mathquillMotionRef.current = mathField;
              }}
            />

            <h2 className='form-title'>Noise characteristics</h2>
            <h4>Noise model</h4>
            <MathQuill
              onChange={handleInputNoiseChange}
              mathquillDidMount={(mathField) => {
                mathquillNoiseRef.current = mathField;
              }}
            />
            
            <Button className='submit-button' size="large" type="submit">Submit</Button>
          </form>
        </Grid>
      </div>
    </div>
  );
};

export default GenerateForm
