import axios from 'axios'

const getReports = async (setReports) => {
  await axios.get('/get_reports')
    .then(response => {
      setReports(response.data.map((file, index) => {
        return {
          title: file.name,
          id: index + 1,
          description: 'Uploading',
        }
      }))
    })
    .catch(error => {
      console.error('Ошибка запроса:', error);
    });
};

export default getReports