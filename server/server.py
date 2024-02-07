from flask import Flask, jsonify, request

from generator import Generator



app = Flask(__name__)


@app.route('/', methods=['POST'])
def generate_data():
    form = request.json  
    generator = Generator(form)
    data = generator.generate()
    print(f'TIME SERIES = {data}')
    data1 = request.json
    return jsonify(data1)


if __name__ == "__main__":
    app.run(debug=True)