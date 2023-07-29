from flask import Flask, request, jsonify, render_template
from models import Movie, session as db
from sqlalchemy import func


app = Flask(__name__)

genres = [
    "action",
    "adventure",
    "animation",
    "comedy",
    "crime",
    "fantasy",
    "horror",
    "mystery",
    "romance",
    "sci-fi",
    "thriller",
]


def movie_to_dict(movie: Movie):
    return {
        "id": movie.id,
        "image": movie.image,
        "title": movie.title,
        "description": movie.description,
        "runtime_str": movie.runtime_str,
        "genres": movie.genres,
        "content_rating": movie.content_rating,
        "imdb_rating": movie.imdb_rating,
        "imdb_rating_votes": movie.imdb_rating_votes,
        "plot": movie.plot,
        "domestic_gross": movie.domestic_gross,
        "worldwide_gross": movie.worldwide_gross,
        "foreign_gross": movie.foreign_gross,
        "budget": movie.budget,
    }


# API route to return data for the first visualization (Top 10 Movies Based on Gross Profit)
@app.route("/api/top_movies_gross_profit")
def get_top_movies_gross_profit():
    year = request.args.get("year")
    query = db.query(Movie)
    if year:
        query = query.filter(Movie.year == int(year))

    query = query.order_by(Movie.worldwide_gross.desc()).limit(10)
    data = [movie_to_dict(movie) for movie in query.all()]
    return jsonify({"data": data})


@app.route("/api/gross_profit_by_genre")
def get_gross_profit_by_genre_api():
    year = request.args.get("year")
    data = []
    query = db.query(Movie)

    if year:
        query = query.filter(Movie.year == int(year))

    for genre in genres:
        genre_query = query.filter(Movie.genres.ilike(f"%{genre}%"))

        genre_sum = sum(
            [movie.worldwide_gross for movie in genre_query if movie.worldwide_gross]
        )
        if genre_sum > 0:
            data.append({"genre": genre, "sum": genre_sum})

    return jsonify({"data": data})


# API route to return data for the third visualization (Top 10 Movies Based on Domestic Gross)
@app.route("/api/top_movies_domestic_gross")
def get_top_movies_domestic_gross():
    year = request.args.get("year")

    query = query = db.query(Movie)
    if year:
        query = query.filter(Movie.year == int(year))

    query = query.order_by(Movie.domestic_gross.desc()).limit(10)

    data = [movie_to_dict(movie) for movie in query.all()]
    return jsonify({"data": data})

# API route to return data for the fourth visualization (Top 10 Movies Based on Foreign Gross) - new
@app.route("/api/top_movies_foreign_gross")
def get_top_movies_foreign_gross():
    year = request.args.get("year")

    query = query = db.query(Movie)
    if year:
        query = query.filter(Movie.year == int(year))

    query = query.order_by(Movie.foreign_gross.desc()).limit(10)

    data = [movie_to_dict(movie) for movie in query.all()]
    return jsonify({"data": data})

# end new

@app.route("/api/top_rated_movies")
def get_top_rated_movies():
    year = request.args.get("year")

    query = db.query(Movie)
    if year:
        query = query.filter(Movie.year == int(year))
    data = (
        query.order_by(
            Movie.imdb_rating.desc(),
        )
        .limit(10)
        .all()
    )
    data = [movie_to_dict(movie) for movie in data]
    return jsonify({"data": data})


@app.route("/api/movies_by_genre")
def get_movies_by_genre():
    genre = request.args.get("genre") or "action"

    movies = (
        db.query(Movie)
        .filter(Movie.genres.ilike(f"%{genre}%"))
        .filter(Movie.domestic_gross.isnot(None))
        .filter(Movie.worldwide_gross.isnot(None))
        .limit(50)
        .all()
    )
    movies_data = [movie_to_dict(movie) for movie in movies]
    return jsonify({"data": movies_data})


@app.route("/")
def index():
    # Query unique years from the movies table
    years = db.query(func.distinct(Movie.year)).filter(Movie.year <= 2020).all()
    years = sorted([year[0] for year in years], reverse=True)
    years = [year for year in years if int(year) <= 2020]

    return render_template("visualization.html", genres=genres, years=years)


if __name__ == "__main__":
    app.run(debug=True)
