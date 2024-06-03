const handleFileSelect = (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log('Сервер ответил:', data);
      })
      .catch(error => {
        console.error('Ошибка:', error);
      });
  }

  export default handleFileSelect;