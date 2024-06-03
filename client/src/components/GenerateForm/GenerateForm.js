import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import MainFeaturedPost from '../MainFeaturedPost';
import './GenerateForm.css'
import { Input } from "@mui/material";

const GenerateForm = ({ onFormSubmit, create }) => {
  const mainFeaturedPost = {
    title: 'Genereting data',
    description:
      "На данной странице Вы можете сгенерировать временной ряд.",
    imageText: 'main image description',
  };
  const buttons = []
  const [formData, setFormData] = useState({
    trendChangesCount: '2',
    noise: 'gaussian',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReport = {
      ...formData, id: Date.now(), title: 'Generating', description: 'generating'
    }
    onFormSubmit(formData, newReport, create);
    setFormData({
      trendChangesCount: '2',
      noise: 'gaussian',
      count: '20'
    })
  };
  console.log(formData)
  return (
    <div>
      <MainFeaturedPost post={mainFeaturedPost} buttons={buttons} />
      <div className='form-container'>
        <Grid container xs={8}>

          <form className='form' onSubmit={handleSubmit}>
            <div className='alert'>
            </div>
            <h2 className='form-title'>Series characteristics</h2>

            <h4>Trend changes count</h4>

            <Input type="text"
              onChange={e => handleChange(e)}
              helperText="Please enter a number"
              name='trendChangesCount'
              value={formData.trendChangesCount}
            />

            <h4>Count</h4>
            <Input type="text"
              onChange={e => handleChange(e)}
              helperText="Please enter a number"
              name='count'
              value={formData.count}
            />

            <h4>Noise model</h4>
            <Box className='field'
              sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel>Noise</InputLabel>
                <Select
                  name='noise'
                  value={formData.noise}
                  label="Noise model"
                  onChange={handleChange}
                >
                  <MenuItem name='noise_model' value='gaussian'>Gaussian Noise</MenuItem>
                  <MenuItem name='noise_model' value='sin(x)'>sin(x)</MenuItem>
                  <MenuItem name='noise_model' value='poisson'>Poisson Noise</MenuItem>
                  <MenuItem name='noise_model' value='speckle'>Speckle Noise</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button className='submit-button' size="large" type="submit">Save</Button>
          </form>
        </Grid>
      </div>
    </div>
  );
};

export default GenerateForm
