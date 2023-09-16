from flask import Flask, request, jsonify
from sklearn.neighbors import NearestNeighbors
import pandas as pd
from pathlib import Path

app = Flask(__name__)

# Read data
file_path = Path("moviesinfos.csv")
df = pd.read_csv(file_path)
df['genres'] = df['genres'].str.split(',')
df_exploded = df.explode('genres')
genre_dummies = pd.get_dummies(df_exploded['genres'], prefix='genre')
genre_dummies = genre_dummies.groupby(level=0).sum()
df = df.drop(columns=['genres'])
df = pd.concat([df, genre_dummies], axis=1)
category_dummies = pd.get_dummies(df['category'], prefix='category')
df = pd.concat([df, category_dummies], axis=1)
df = df.drop(columns=['category'])

# Setting up the Nearest Neighbors model
features = [col for col in df.columns if "genre_" in col]
movie_features = df[features]
model_knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=11)
model_knn.fit(movie_features)

def get_recommendations(title):
    idx = df[df['title'] == title].index[0]
    distances, indices = model_knn.kneighbors(movie_features.iloc[idx].values.reshape(1, -1))
    movie_indices = indices.flatten()[1:]
    return df['title'].iloc[movie_indices].tolist()

@app.route('/recommend', methods=['GET'])
def recommend():
    title = request.args.get('title')
    if title:
        try:
            recommendations = get_recommendations(title)
            return jsonify(recommendations)
        except Exception as e:
            return jsonify({"error": str(e)}), 400
    else:
        return jsonify({"error": "Title is required"}), 400

if __name__ == '__main__':
    app.run(debug=True)



