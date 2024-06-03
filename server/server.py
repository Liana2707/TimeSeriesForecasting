
import io
import os
from flask import Flask, jsonify, request, send_file
import json
import pandas as pd

from generation_data.generator import Generator
from algorithms.algorithm_factory import AlgorithmFactory
from uploading_data.uploader import Uploader


UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/get_reports', methods=['GET'])
def get_reports():
   try:
      files = os.listdir(UPLOAD_FOLDER)
      files_data = [{'name': filename } for filename in files]
      return jsonify(files_data)
   except:
      return jsonify({'error': 'Ошибка чтения папки'})

@app.route('/generate', methods=['POST'])
def generate_data():
    form = request.json  
    generator = Generator()
    data = generator.generate(form)
    dates, data = generator.generate(form)
    
    df = pd.DataFrame({ 'Date': dates, 'Value': data })
    csv_buffer = io.BytesIO()
    df.to_csv(csv_buffer, index=False)
    csv_buffer.seek(0)
    
    return send_file(csv_buffer, mimetype='text/csv', as_attachment=True, download_name='generated_data.csv')


@app.route('/upload', methods=['POST'])
def upload_file():
   if 'file' not in request.files:
      return jsonify({'error': 'No file part'})

   file = request.files['file']

   if file.filename == '':
      return jsonify({'error': 'No selected file'})

   if file:
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
      return jsonify({'request': 'uploaded'})
   
   return jsonify({'error': 'No file'})


@app.route('/get_file/<filename>', methods=['GET'])
def get_file(filename):
   try:
      file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
      uploader = Uploader()
      data = uploader.upload(file_path)
      values = data[0]
      date_columns = data[1]
      value_columns = [col for col in values.columns if col not in data[1]]
    
      return jsonify({
         'data': values.values.tolist(),
         'columns': values.columns.tolist(),
         'date_columns': date_columns,
         'value_columns': value_columns
      })
   except:
      return jsonify({'error': 'Ошибка чтения файла'})
   
@app.route('/get_algorithms', methods=['GET'])
def get_algorithms():
   with open('config/algorithms.json', 'r') as file:
      algorithms_data = json.load(file)
   
   algorithms_list = algorithms_data.get('algorithms', [])
   return jsonify({'algorithms': algorithms_list})

@app.route('/save_results', methods=['POST'])
def save_forecast():
   services_fields = ['id', 'algorithmName', 'dateColumn', 'valueColumn', 'windowSize','fileName','date']
   data = request.json.get('formData', {})

   id = data.get('id')
   algorithm_name = data.get('algorithmName')
   date_column =  data.get('dateColumn')
   value_column = data.get('valueColumn')
   params = {key: value for key, value in data.items() if key not in services_fields}

   algorithm = AlgorithmFactory.create_algorithm(
      id,
      algorithm_name, 
      date_column, 
      value_column,
      params)
   
   file_name = data.get('fileName')
   if algorithm:
      algorithm.predict(file_name)
      buffer = io.BytesIO()
      buffer = algorithm.save_results(file_name, buffer)

      buffer.seek(0)

      return send_file(buffer, as_attachment=True, download_name=f'results_{file_name}')
   else:
      return jsonify({'error': 'Algorithm not found'}), 400



@app.route('/add_forecast', methods=['POST'])
def add_forecast():
      services_fields = ['id', 'algorithmName', 'dateColumn', 'valueColumn', 'windowSize','fileName','date']
      data = request.json.get('formData', {})

      id = data.get('id')
      algorithm_name = data.get('algorithmName')
      date_column =  data.get('dateColumn')
      value_column = data.get('valueColumn')
      params = {key: value for key, value in data.items() if key not in services_fields}

      algorithm = AlgorithmFactory.create_algorithm(
         id,
         algorithm_name, 
         date_column, 
         value_column,
         params)
      
      file_name = data.get('fileName')
      if algorithm:
         dataset, conf_intervals_lower, conf_intervals_upper, trend_changes = algorithm.predict(file_name)
         return jsonify({'dataset': dataset, 
                         'confidense_intervals_lower': conf_intervals_lower,
                         'confidense_intervals_upper': conf_intervals_upper,
                         'trend_changes': trend_changes
                         })
      else:
         return jsonify({'error': 'Algorithm not found'}), 400


if __name__ == "__main__":
    app.run(debug=True)