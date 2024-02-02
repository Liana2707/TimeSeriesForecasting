import React, { useState } from 'react';

const GenerateForm = ({ onFormSubmit }) => {
  const [formData, setFormData] = useState({
    fieldName: 'liana',
    anotherField: 'nafikova',
  });

  const handleChange = (e) => {
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

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="fieldName" value={formData.fieldName} onChange={handleChange} /> 
      <input type="text" name="anotherField" value={formData.anotherField} onChange={handleChange} /> 

      <button type="submit">Submit</button>
    </form>
  );
};

export default GenerateForm;