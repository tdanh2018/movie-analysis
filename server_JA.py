from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['movie_analysis']
collection = db['movies']

@app.route('/movies/<year>', methods=['GET'])
def get_movies(year):
    movies = list(collection.find({"Year": int(year)}, {"_id": 0}))
    return jsonify(movies)

@app.route('/years', methods=['GET'])
def get_years():
    years = collection.distinct('Year')
    return jsonify(years)

if __name__ == '__main__':
    app.run(port=3000)
