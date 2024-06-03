import React from "react";
import { Input } from "@mui/material";

const NumberInput = ({ handleChange, name }) => {
  return (
    <div style={{ display: 'flex' }}>
      <div>{name}:</div>
      <Input type="text"
        required
        onChange={e => handleChange(e)}
        helpertext="Please enter a number"
        name={name}
      />
    </div>
  );
}

export default NumberInput