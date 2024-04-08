import React from "react";
import { useEffect } from "react";
import Title from "./Title";

import { ButtonGroup, Button, Grid } from "@mui/material";
import NumberInput from "../UI/NumberInput";
import MatrixInput from "../UI/MatrixInput";
import VectorInput from "../UI/VectorUnput";
import SaveResults from "../requests/SaveResults";


const AlgorithmForm = ({ name, description, params, onFormSubmit, addTrends, fileName, date,
    value }) => {

    const [values, setValues] = React.useState({
        id: Date.now(),
        dateColumn: date,
        valueColumn: value,
        fileName: fileName,
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

    const Save = (e) => {
        e.preventDefault();
        SaveResults(values)
    }

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
                            <Button onClick={Save}>Save</Button>
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