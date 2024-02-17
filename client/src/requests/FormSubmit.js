

const handleFormSubmit = async (formData, newReport, create) => {
    try {
      const response = await fetch('/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const result = await response.json();
      console.log('Server response:', result);
      create(newReport)

    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

export default handleFormSubmit