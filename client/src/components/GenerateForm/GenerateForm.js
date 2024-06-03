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
    title: 'Генерация данных',
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
      ...formData, id: Date.now(), title: 'Генерация', description: 'generating'
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
            <h2 className='form-title'>Характеристики ряда</h2>

            <h4>Количество изменений тренда</h4>

            <Input type="text"
              onChange={e => handleChange(e)}
              helperText="Пожалуйста, введите число"
              name='trendChangesCount'
              value={formData.trendChangesCount}
            />

            <h4>Количество измерений</h4>
            <Input type="text"
              onChange={e => handleChange(e)}
              helperText="Пожалуйста, введите число"
              name='count'
              value={formData.count}
            />

            <h4>Характеристики шума</h4>
            <Box className='field'
              sx={{ minWidth: 120 }}>
              <FormControl fullWidth>
                <InputLabel>Модель шума</InputLabel>
                <Select
                  name='noise'
                  value={formData.noise}
                  label="Модель шума"
                  onChange={handleChange}
                >
                  <MenuItem name='noise_model' value='gaussian'>Гауссовский шум</MenuItem>
                  <MenuItem name='noise_model' value='sin(x)'>sin(x)</MenuItem>
                  <MenuItem name='noise_model' value='poisson'>Пуассоновский шум</MenuItem>
                  <MenuItem name='noise_model' value='speckle'>Спекл-шум</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Button className='submit-button' size="large" type="submit">Создать ряд</Button>
          </form>
        </Grid>
      </div>
    </div>
  );
};

export default GenerateForm
