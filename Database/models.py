from sqlalchemy import Column, String, Integer, Float, create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

Base = declarative_base()


class Movie(Base):
    __tablename__ = "movies"

    id = Column(String, primary_key=True)
    image = Column(String)
    title = Column(String)
    description = Column(String)
    runtime_str = Column(String)
    genres = Column(String)
    content_rating = Column(String)
    imdb_rating = Column(Float)
    imdb_rating_votes = Column(Integer)
    plot = Column(String)
    domestic_gross = Column(Integer)
    worldwide_gross = Column(Integer)
    year = Column(Integer)
    budget = Column(Integer)


engine = create_engine("sqlite:///movies.db")
Base.metadata.create_all(engine)

Session = sessionmaker(bind=engine)
session = Session()
