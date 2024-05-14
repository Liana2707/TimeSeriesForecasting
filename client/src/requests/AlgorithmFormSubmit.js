import axios from 'axios'

const handleAlgorithmFormSubmit = async (formData, addTrends) => {
  await axios.post(`/add_forecast`, { formData })
    .then(response => {
      addTrends(response.data.dataset, [response.data.prediction_intervals_lower,
        response.data.prediction_intervals_upper,
        response.data.confidense_intervals_lower,
        response.data.confidense_intervals_upper
      ])
    })
    .catch(error => {
      console.error('Ошибка запроса:', error);
    });
};

export default handleAlgorithmFormSubmit