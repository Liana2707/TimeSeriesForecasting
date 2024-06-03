import axios from 'axios'

const getAlgorithms = async (setAlgorithms) => {
  await axios.get(`/get_algorithms`)
    .then(response => {
      setAlgorithms(response.data.algorithms)
    })
    .catch(error => {
      console.error('Ошибка запроса:', error);
    });
};

export default getAlgorithms