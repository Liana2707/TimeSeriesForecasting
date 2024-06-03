import axios from 'axios'

const handleAlgorithmFormSubmit = async (formData, addTrends) => {
  await axios.post(`/add_forecast`, { formData })
    .then(response => {
      addTrends(response.data.dataset, [
        response.data.confidense_intervals_lower,
        response.data.confidense_intervals_upper,
      ],
        response.data.trend_changes
      )
    })
    .catch(error => {
      console.error('Ошибка запроса:', error);
    });
};

export default handleAlgorithmFormSubmit