const API_KEY = 'k_ubtu0kka';

async function fetchDataFromAPI() {
  try {
    const response = await fetch(`https://imdb-api.com/en/API/Top250Movies/${API_KEY}`);
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching data from IMDb API:', error);
    throw error;
  }
}

function sortMovies(movies, sortBy) {
  switch (sortBy) {
    case 'imdbRatingDesc':
      return movies.sort((a, b) => b.imDbRating - a.imDbRating);
    case 'imdbRatingAsc':
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
      // Fetch and display awards and nominations for the clicked movie
      displayAwardsAndNominations(movie.imDbId);
    });

    moviesContainer.appendChild(movieDiv);
  });
}

async function displayAwardsAndNominations(imdbId) {
  try {
    const response = await fetch(`https://imdb-api.com/en/API/NameAwards/${API_KEY}/${imdbId}`);
    const data = await response.json();

    const awardsContainer = document.getElementById('awards-container');
    awardsContainer.innerHTML = '';

    if (data.items && data.items.length > 0) {
      data.items.forEach((event) => {
        const eventTitle = document.createElement('h4');
        eventTitle.textContent = event.eventTitle;
        awardsContainer.appendChild(eventTitle);

        event.nameAwardEventDetails.forEach((detail) => {
          const awardDiv = document.createElement('div');
          awardDiv.classList.add('award-item');
          awardDiv.innerHTML = `
            <img class="award-image" src="${detail.image}" alt="${detail.title} Image">
            <h5 class="award-title">${detail.title}</h5>
            <p class="award-for">${detail.for}</p>
            <p class="award-description">${detail.description}</p>
          `;
          awardsContainer.appendChild(awardDiv);
        });
      });
    } else {
      const noAwardsMessage = document.createElement('p');
      noAwardsMessage.textContent = 'No awards and nominations found for this movie.';
      awardsContainer.appendChild(noAwardsMessage);
    }
  } catch (error) {
    console.error('Error fetching awards and nominations:', error);
  }
}

async function main() {
  try {
    const data = await fetchDataFromAPI();
    let moviesData = data;

    const awardFilter = document.getElementById('award-filter');
    const popularityFilter = document.getElementById('popularity-filter');
    const sortFilter = document.getElementById('sort-filter');

    function filterAndSortMovies() {
      const selectedAward = awardFilter.value;
      const selectedPopularity = popularityFilter.value;
      const selectedSort = sortFilter.value;

      let filteredMovies = data;

      if (selectedAward !== 'all') {
        filteredMovies = filteredMovies.filter((movie) => {
          if (selectedAward === 'yes') {
            return movie.awards !== 'N/A';
          } else if (selectedAward === 'no') {
            return movie.awards === 'N/A';
          }
        });
      }

      if (selectedPopularity !== 'all') {
        filteredMovies = filteredMovies.filter((movie) => {
          if (selectedPopularity === 'high') {
            return movie.imDbRating >= 8.0;
          } else if (selectedPopularity === 'medium') {
            return movie.imDbRating >= 7.0 && movie.imDbRating < 8.0;
          } else if (selectedPopularity === 'low') {
            return movie.imDbRating < 7.0;
          }
        });
      }

      moviesData = sortMovies(filteredMovies, selectedSort);
      displayMovies(moviesData);
    }

    awardFilter.addEventListener('change', filterAndSortMovies);
    popularityFilter.addEventListener('change', filterAndSortMovies);
    sortFilter.addEventListener('change', filterAndSortMovies);

    displayMovies(moviesData);
  } catch (error) {
    console.error('Error in the main process:', error);
  }
}

main();
