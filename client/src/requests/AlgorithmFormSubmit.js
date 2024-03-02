import axios from 'axios'

const handleAlgorithmFormSubmit = async (formData, addTrends) => {
  await axios.post(`/add_forecast`, { formData })
    .then(response => {
      addTrends(response.data.dataset)
    })
    .catch(error => {
      console.error('Ошибка запроса:', error);
    });
};

export default handleAlgorithmFormSubmit