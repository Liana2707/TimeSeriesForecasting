import * as React from 'react';
import { useState, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Button } from '@mui/material';

import getAlgorithms from '../../requests/GetAlgorithms';
import handleAlgorithmFormSubmit from "../../requests/AlgorithmFormSubmit";

import Title from '../Title';
import AlgorithmForm from '../AlgorithmForm';

import "./Deposits.css"

export default function Deposits({ mainData,
  value,
  onValueChange,
  date,
  onDateChange,
  forms,
  setForms,
  addTrends,
  fileName }) {
  const [algorithms, setAlgorithms] = useState([])
  const [selectedAlgorithm, setSelectedAlgorithm] = useState({})
  const [algorithmName, setAlgorithmName] = useState('')
  useEffect(() => { getAlgorithms(setAlgorithms) }, []);


  const addForm = (props) => {
    if (Object.keys(props).length !== 0) {
      setForms(
        [...forms,
        <AlgorithmForm {...props}
          fileName={fileName}
          date={date}
          value={value}
          onFormSubmit={handleAlgorithmFormSubmit}
          addTrends={addTrends} />
        ]);
    }
  };

  const EditAlgorithm = (newValue) => {
    setSelectedAlgorithm(algorithms.filter(elem => elem.name === newValue)[0]);
    setAlgorithmName(newValue)
  }

  return (
    <div>
      <Autocomplete className='auto-complete'
        options={mainData.dateColumns}
        value={date}
        onChange={(_, newValue) => {
          onDateChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Столбец дат" />}
      />

      <Autocomplete className='auto-complete'
        options={mainData.valueColumns}
        value={value}
        onChange={(_, newValue) => {
          onValueChange(newValue);
        }}
        renderInput={(params) => <TextField {...params} label="Столбец значений" />}
      />

      <div className='forecasting-text'>
        <Title >Предсказание</Title>
      </div>

      <Autocomplete className='auto-complete'
        options={algorithms.map(alg => alg.name)}
        value={algorithmName}
        onChange={(_, newValue) => EditAlgorithm(newValue)
        }
        renderInput={(params) => <TextField {...params} label="Алгоритм" />}
      />

      <div className='forecasting-text'>
        <Button variant="outlined"
          onClick={_ => addForm(selectedAlgorithm)}>
          Добавить предсказание
        </Button>
      </div>
    </div>

  );
}