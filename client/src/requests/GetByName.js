import axios from 'axios'

const getByName = async (name, set) => {
  await axios.get(`/get_file/${name}`)
    .then(response => {
      set({
        values: response.data.data,
        dateColumns: response.data.date_columns,
        valueColumns: response.data.value_columns,
        columns: response.data.columns,
      });
    })
    .catch(error => {
      console.error('Ошибка запроса:', error);
    });
};

export default getByName