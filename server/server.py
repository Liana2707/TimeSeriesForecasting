from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

@app.route('/', methods=['POST'])
def process_data():
    data = request.json  # Получение данных из запроса
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)