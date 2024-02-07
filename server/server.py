import os
from flask import Flask, jsonify, request

from generator import Generator

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route('/generate', methods=['POST'])
def generate_data():
    form = request.json  
    generator = Generator(form)
    data = generator.generate()
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
      filename = 'pivet'
      file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
      return jsonify({'success': True, 'filename': filename})


if __name__ == "__main__":
    app.run(debug=True)