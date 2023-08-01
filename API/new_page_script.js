const API_KEY = 'k_ubtu0kka';

async function fetchMovieAwardsData(imdbId) {
  try {
    const response = await fetch(`https://imdb-api.com/en/API/Awards/${API_KEY}/${imdbId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie awards data:', error);
    throw error;
  }
}

function displayAwardsAndNominations(movieData) {
  const awardsContainer = document.getElementById('awards-container');
  awardsContainer.innerHTML = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  // Table headers
  const headers = ['Event', 'Image', 'Title', 'For', 'Description'];
  const trHead = document.createElement('tr');
  headers.forEach(header => {
    const th = document.createElement('th');
    th.textContent = header;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  // Table body
  if (movieData && movieData.items && movieData.items.length > 0) {
    movieData.items.forEach((event) => {
      event.awardEventDetails.forEach((detail) => {
        const trBody = document.createElement('tr');
        const tdEvent = document.createElement('td');
        tdEvent.textContent = event.eventTitle;
        trBody.appendChild(tdEvent);

        const tdImage = document.createElement('td');
        const img = document.createElement('img');
        img.src = detail.image;
        img.classList.add('award-image');
        tdImage.appendChild(img);
        trBody.appendChild(tdImage);

        const tdTitle = document.createElement('td');
        tdTitle.textContent = detail.title;
        trBody.appendChild(tdTitle);

        const tdFor = document.createElement('td');
        tdFor.textContent = detail.for;
        trBody.appendChild(tdFor);

        const tdDesc = document.createElement('td');
        tdDesc.textContent = detail.description;
        trBody.appendChild(tdDesc);

        tbody.appendChild(trBody);
      });
    });
  }

  table.appendChild(thead);
  table.appendChild(tbody);
  awardsContainer.appendChild(table);
}

async function main() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const imdbId = urlParams.get('imdbId');

    if (imdbId) {
      const movieData = await fetchMovieAwardsData(imdbId);
      displayAwardsAndNominations(movieData);
    } else {
      console.error('No IMDb ID provided.');
    }

    const backButtonTop = document.getElementById('back-button');
    const backButtonBottom = document.getElementById('back-button-bottom');

    backButtonTop.addEventListener('click', () => {
      // Navigate back to the main page
      window.history.back();
    });

    backButtonBottom.addEventListener('click', () => {
      // Navigate back to the main page
      window.history.back();
    });
  } catch (error) {
    console.error('Error in the main process:', error);
  }
}

main();
