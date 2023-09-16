from flask import Flask, request, jsonify
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import LabelEncoder
from pathlib import Path
import pandas as pd

app = Flask(__name__)

# Read data
file_path = Path("movies_merged.csv")
df = pd.read_csv(file_path)

# Label Encoding 'primaryName'
encoder = LabelEncoder()
df['encoded_primaryName'] = encoder.fit_transform(df['primaryName'])

# Selecting the features for the KNN model
knn_columns = ['startYear', 'encoded_primaryName', 'runtimeMinutes', 'averageRating'] \
              + [col for col in df.columns if 'genre_' in col] \
              + ['category_actor', 'category_actress', 'category_director']

knn_df = df[knn_columns].astype(float)  # Ensure all values are float

# Initialize the model
model_knn = NearestNeighbors(metric='cosine', algorithm='brute', n_neighbors=11)
model_knn.fit(knn_df)

def get_recommendations(title):
    idx = df[df['title'] == title].index[0]
    distances, indices = model_knn.kneighbors(knn_df.iloc[idx].values.reshape(1, -1))
    movie_indices = indices.flatten()[1:]
    return df['title'].iloc[movie_indices]

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/recommend', methods=['POST'])
def recommend():
    try:
        title = request.json['title']
        recommendations = get_recommendations(title)
        return jsonify({'recommendations': recommendations.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)

