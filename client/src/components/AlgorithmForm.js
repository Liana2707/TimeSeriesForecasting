import React from "react";
import { useEffect } from "react";
import Title from "./Title";

import { ButtonGroup, Button, Grid, Autocomplete, TextField } from "@mui/material";
import NumberInput from "../UI/NumberInput";
import MatrixInput from "../UI/MatrixInput";
import VectorInput from "../UI/VectorUnput";


const AlgorithmForm = ({ name, description, params, onFormSubmit, addTrends, fileName, date,
    value }) => {

    const [values, setValues] = React.useState({
        id: Date.now(),
        dateColumn: date,
        valueColumn: value,
        fileName: fileName,
        windowSize: 5,
        algorithmName: name
    });

    useEffect(() => {
        setValues(prevValues => ({
            ...prevValues,
            dateColumn: date,
            valueColumn: value
        }));
    }, [date, value]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onFormSubmit(values, addTrends);
    };


    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value,
        });
    };

    const renderParameter = (param) => {
        switch (param.type) {
            case 'number':
                return <NumberInput handleChange={handleChange} name={param.name}/>   
            case 'matrix':
                return <MatrixInput handleChange={handleChange} name={param.name}/>
            case 'vector':
                return <VectorInput handleChange={handleChange} name={param.name}/>       
            default:
                return null;
        }
    };
    return (
        <form className='form' onSubmit={handleSubmit}>
            <div className="forecasting-text">
                <Title>{name} Algorithm</Title>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <div>
                        <Autocomplete className='auto-complete'
                            options={Array.from({ length: 20 }, (_, i) => i + 3)}
                            value={values.windowSize}
                            onChange={(_, newValue) => setValues(prevValues => ({
                                ...prevValues,
                                windowSize: newValue
                            }))}
                            renderInput={(params) => <TextField {...params} label="Window size" />}
                        />
                        {params.map((param, index) => (
                            <div key={index}>
                                {renderParameter(param)}
                            </div>
                        ))}
                    </div>
                    <div style={{ margin: '10px' }}>
                        <ButtonGroup
                            orientation="horizontal"
                            size="large"
                            variant="outlined"
                        >
                            <Button type='submit'>Forecast</Button>
                            <Button>Save</Button>
                        </ButtonGroup>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <Title>{description}</Title>
                </Grid>

            </Grid>


        </form>
    )
}

export default AlgorithmForm