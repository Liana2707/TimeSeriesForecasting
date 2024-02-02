import React from "react";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';


const AutocompleteInput = ({title, options}) => {
    const [value, setValue] = React.useState(options[0]);
    const [inputValue, setInputValue] = React.useState('');
    return (
        <div>
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                id="controllable-states-demo"
                options={options}
                renderInput={(params) => <TextField {...params} label={title} />}
            />
                <br />
                <div>{`value: ${value !== null ? `'${value}'` : 'null'}`}</div>
                <div>{`inputValue: '${inputValue}'`}</div>
        </div>
    )
}

export default AutocompleteInput