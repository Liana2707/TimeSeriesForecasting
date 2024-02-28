import axios from 'axios'

const handleAlgorithmFormSubmit = async (formData) => {
    await axios.post(`/add_forecast`, {formData})
    .then(response => {
        console.log(formData)
        console.log(response)
    })
    .catch(error => {
      console.error('Ошибка запроса:', error);
    });
};

export default handleAlgorithmFormSubmit