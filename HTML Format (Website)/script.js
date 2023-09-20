const API_KEY = 'k_ubtu0kka';

function sortMovies(movies, sortBy) {
  switch (sortBy) {
    case 'imDbRatingDesc':
      return movies.sort((a, b) => b.imDbRating - a.imDbRating);
    case 'imDbRatingAsc':
      return movies.sort((a, b) => a.imDbRating - b.imDbRating);
    case 'titleAsc':
      return movies.sort((a, b) => a.title.localeCompare(b.title));
    case 'titleDesc':
      return movies.sort((a, b) => b.title.localeCompare(a.title));
    case 'yearDesc':
      return movies.sort((a, b) => b.year - a.year);
    case 'yearAsc':
      return movies.sort((a, b) => a.year - b.year);
    default:
      return movies;
  }
}

function displayMovies(movies) {
  const moviesContainer = document.getElementById('movies-container');
  moviesContainer.innerHTML = '';

  movies.forEach((movie) => {
    const movieDiv = document.createElement('div');
    movieDiv.classList.add('movie-card');
    movieDiv.innerHTML = `
      <h3 class="movie-title">${movie.title} (${movie.year})</h3>
      <img class="movie-poster" src="${movie.image}" alt="${movie.title} Poster">
      <div class="movie-rating">
        <svg class="star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none"/>
          <path d="M12 2l2.5 6H22l-5 4.5 1.5 6-4-3-4 3 1.5-6-5-4.5h7.5z"/>
        </svg>
        ${movie.imDbRating}
      </div>
    `;

    movieDiv.addEventListener('click', () => {
      sessionStorage.setItem("scrollPosition", window.pageYOffset);
      window.location.href = `new_page.html?imdbId=${movie.id}`;
    });

    moviesContainer.appendChild(movieDiv);
  });

  if (sessionStorage.getItem("scrollPosition")) {
    window.scrollTo(0, sessionStorage.getItem("scrollPosition"));
  }
}

function processMovieData(csvData) {
  const { data } = Papa.parse(csvData, { header: true, skipEmptyLines: true });

  const moviesData = data.map(movie => {
    const { id, image, title, description, imDbRating } = movie;
    const year = description.match(/\((\d+)\)/)[1]; // Correctly extracting year
    return {
      id,
      title,
      year: year ? parseInt(year) : null,
      imDbRating: imDbRating ? parseFloat(imDbRating) : null,
      image
    };
  });

  return moviesData;
}

async function fetchMovieData() {
  try {
    const response = await fetch('movie_list.csv');
    const data = await response.text();
    const moviesData = processMovieData(data);
    return moviesData;
  } catch (error) {
    console.error('Error fetching movie data:', error);
    throw error;
  }
}

async function main() {
  try {
    const movieData = await fetchMovieData();
    const sortFilter = document.getElementById('sort-filter');

    if (sessionStorage.getItem("selectedSort")) {
      sortFilter.value = sessionStorage.getItem("selectedSort");
    }

    function filterAndSortMovies() {
      const selectedSort = sortFilter.value;
      sessionStorage.setItem("selectedSort", selectedSort);
      const sortedMoviesData = sortMovies(movieData.slice(), selectedSort);
      displayMovies(sortedMoviesData);
    }

    sortFilter.addEventListener('change', filterAndSortMovies);

    if (sessionStorage.getItem("selectedSort")) {
      filterAndSortMovies();
    } else {
      displayMovies(movieData);
    }

    // Scroll to top button
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.textContent = 'Return to Top';
    scrollToTopButton.classList.add('return-button');
    scrollToTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });

    const returnButtonContainer = document.createElement('div');
    returnButtonContainer.classList.add('return-button-container');
    returnButtonContainer.appendChild(scrollToTopButton);

    document.body.appendChild(returnButtonContainer);

    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        returnButtonContainer.style.display = 'block';
      } else {
        returnButtonContainer.style.display = 'none';
      }
    });

  } catch (error) {
    console.error('Error in the main process:', error);
  }
}

main();
