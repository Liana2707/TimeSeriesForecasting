import os
from flask import Flask, jsonify, redirect, request, url_for
import pandas as pd

from generator import Generator
from uploader import Uploader

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/generate', methods=['POST'])
def generate_data():
    form = request.json  
    generator = Generator()
    data = generator.generate(form)
    print(f'TIME SERIES = {data}')
    data1 = request.json
    return jsonify(data1)

@app.route('/upload', methods=['POST'])
def upload_file():
   if 'file' not in request.files:
      return jsonify({'error': 'No file part'})

   file = request.files['file']

   if file.filename == '':
      return jsonify({'error': 'No selected file'})

   if file:
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
      return redirect(url_for('process_file', filename=file.filename))
   
   return jsonify({'error': 'No file'})

@app.route('/process/<filename>')
def process_file(filename):
   file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
   uploader = Uploader()
   data = uploader.upload(file_path)
   return  jsonify({'success': True})

if __name__ == "__main__":
    app.run(debug=True)