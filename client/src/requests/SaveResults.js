import axios from 'axios'

const SaveResults = async (formData) => {
  try {
    const response = await axios.post('/save_results', { formData }, { responseType: 'blob' });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'results.csv'); 
    document.body.appendChild(link);

    link.click();
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка загрузки файла:', error);
  }
};

export default SaveResults