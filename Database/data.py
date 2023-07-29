import requests
import pandas as pd
import re
import sqlalchemy


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


api_key = "k_ubtu0kka"
base_url = "https://imdb-api.com/API/"


# Get movie rating, genres, imDb rating votes, description, content rating, image and title
def fetch_movie_title_data(title_id) -> dict:
    url = f"{base_url}Title/{api_key}/{title_id}"
    response = requests.get(url)
    return response.json()


# Get movie gross data
def get_box_office_all_time_movies() -> list[dict]:
    url = f"{base_url}BoxOfficeAllTime/{api_key}"
    response = requests.get(url)

    return response.json()["items"]


def parse_movie(movie_data) -> dict:
    # Parse the movie data
    movie_id = movie_data["id"]
    image = movie_data["image"]
    title = movie_data["title"]
    description = movie_data["fullTitle"]
    runtime_str = movie_data["runtimeStr"]
    genres = movie_data["genres"]
    content_rating = movie_data["contentRating"]
    imdb_rating = float(movie_data["imDbRating"]) if movie_data["imDbRating"] else None
    imdb_rating_votes = (
        int(movie_data["imDbRatingVotes"]) if movie_data["imDbRatingVotes"] else None
    )
    plot = movie_data["plot"]

    # Convert gross data to numbers by removing non-numeric characters
    domestic_gross = re.sub(r"[^\d]", "", movie_data["domesticLifetimeGross"] or "")
    worldwide_gross = re.sub(r"[^\d]", "", movie_data["worldwideLifetimeGross"] or "")

    domestic_gross = int(domestic_gross) if domestic_gross else None
    worldwide_gross = int(worldwide_gross) if worldwide_gross else None

    if movie_data["boxOffice"] and movie_data["boxOffice"].get("budget"):
        budget = re.sub(r"[^\d]", "", movie_data["boxOffice"].get("budget"))
        budget = int(budget) if budget else None
    else:
        budget = None

    # Create the dictionary with parsed movie data
    parsed_movie = {
        "id": movie_id,
        "image": image,
        "title": title,
        "description": description,
        "runtime_str": runtime_str,
        "genres": genres,
        "content_rating": content_rating,
        "imdb_rating": imdb_rating,
        "imdb_rating_votes": imdb_rating_votes,
        "plot": plot,
        "domestic_gross": domestic_gross,
        "worldwide_gross": worldwide_gross,
        "year": int(movie_data["year"]),
        "budget": budget,
    }

    return parsed_movie


if __name__ == "__main__":
    gross_data = get_box_office_all_time_movies()

    movie_data_list = []
    for movie_data in gross_data:
        try:
            title_id = movie_data["id"]
            movie_detail = fetch_movie_title_data(title_id)
            movie_data.update(movie_detail)

            parsed_movie_data = parse_movie(movie_data)
            movie_data_list.append(parsed_movie_data)

        except Exception as e:
            print(e)

    # Create a DataFrame from the list of movie data
    df = pd.DataFrame(movie_data_list)
    df = df[df["year"] <= 2020]

    print(df.head())

    # Export DataFrame to SQLite file
    engine = sqlalchemy.create_engine("sqlite:///movies.db")
    df.to_sql("movies", engine, if_exists="replace", index=False)

    # Export the movies to csv
    df.to_csv("movies.csv")
