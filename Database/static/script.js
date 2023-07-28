// Function to fetch data from the API
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

// Function to render the Top 10 Movies Based on Gross Profit chart
function renderGrossProfitChart(data, year = "") {
    const grossProfitChart = {
        x: data.data.map(movie => movie.title),
        y: data.data.map(movie => movie.worldwide_gross),
        type: 'bar',
        name: 'Gross Profit',

    };

    const budgetChart = {
        x: data.data.map(movie => movie.title),
        y: data.data.map(movie => movie.budget),
        type: 'bar',
        name: 'Budget'
    };

    const grossProfitLayout = {
        title: `Top 10 Movies ${year ? `In ${year}` : ""} Based on Worldwide Gross Profit and Budget ($)`,
        xaxis: { title: 'Movie Title' },
        yaxis: { title: 'Amount ($)' },
        barmode: 'group' // This will group the bars for Gross Profit and Budget side by side
    };

    Plotly.newPlot('gross-profit-chart', [grossProfitChart, budgetChart], grossProfitLayout, { responsive: true });
}

// Function to render the Gross Profit Based on Genre pie chart
function renderGenrePieChart(data, year = "") {
    const genrePieChart = {
        values: data.data.map(row => row.sum),
        labels: data.data.map(row => row.genre),
        type: 'pie',
        texttemplate: "%{label}:  (%{percent})",
        textposition: "inside",
    };

    const genrePieLayout = {
        title: `Gross ${year ? `In ${year}` : ""} Profit Based on Genre($)`,

    };

    Plotly.newPlot('genre-pie-chart', [genrePieChart], genrePieLayout, { responsive: true });
}
function renderTopRatedMoviesChart(data, year = "") {
    const topRatedMoviesChart = {
        x: data.data.map(movie => movie.title),
        y: data.data.map(movie => movie.imdb_rating),
        type: 'bar',
        marker: {
            color: 'rgb(148, 103, 189)',
        },

    };

    const topRatedMoviesLayout = {
        title: `Top 10 Rated Movies ${year ? `In ${year}` : ""}`,
        xaxis: { title: 'Movie Title' },
        yaxis: { title: 'IMDb Rating' },
    };

    Plotly.newPlot('top-rated-movies-chart', [topRatedMoviesChart], topRatedMoviesLayout, { responsive: true });
}

// Function to render the Top 10 Movies Based on Domestic Gross chart
function renderDomesticGrossChart(data, year = "") {
    const domesticGrossChart = {
        x: data.data.map(movie => movie.title),
        y: data.data.map(movie => movie.domestic_gross),
        type: 'bar',

        name: 'Domestic Gross'
    };

    const budgetChart = {
        x: data.data.map(movie => movie.title),
        y: data.data.map(movie => movie.budget),
        type: 'bar',

        name: 'Budget'
    };

    const domesticGrossLayout = {
        title: `Top 10 Movies ${year ? `In ${year}` : ""} Based on Domestic Gross and Budget ($)`,
        xaxis: { title: 'Movie Title' },
        yaxis: { title: 'Amount ($)' },
        barmode: 'group'
    };

    Plotly.newPlot('domestic-gross-chart', [domesticGrossChart, budgetChart], domesticGrossLayout, { responsive: true });
}
function renderMoviesTable(data) {
    const tableBody = document.querySelector("#movies-table tbody");
    tableBody.innerHTML = "";

    data.data.forEach((movie, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td><img src="${movie.image}" width="40px"></td>
                <td>${movie.title}</td>
                <td>${movie.description}</td>
                <td>${movie.genres}</td>
                <td>${movie.content_rating}</td>
                <td>${movie.imdb_rating}</td>
                <td>${movie.imdb_rating_votes}</td>
                <td>${movie.budget}</td>
                <td>${movie.domestic_gross}</td>
                <td>${movie.worldwide_gross}</td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}
function handleGrossProfitYearChange() {
    const selectedYear = document.getElementById("gross-profit-year").value;
    const year = selectedYear == "all" ? "" : selectedYear
    fetchData(`/api/top_movies_gross_profit?year=${year}`)
        .then(data => renderGrossProfitChart(data, year));
}

function handleDomesticGrossYearChange() {
    const selectedYear = document.getElementById("domestic-gross-year").value;
    const year = selectedYear == "all" ? "" : selectedYear
    fetchData(`/api/top_movies_domestic_gross?year=${year}`)
        .then(data => renderDomesticGrossChart(data, year));
}

function handleGenrePieYearChange() {
    const selectedYear = document.getElementById("genre-pie-year").value;
    const year = selectedYear == "all" ? "" : selectedYear
    fetchData(`/api/gross_profit_by_genre?year=${year}`)
        .then(data => renderGenrePieChart(data, year));
}
function handleRatingsYearChange() {
    const selectedYear = document.getElementById("ratings-year").value;
    const year = selectedYear == "all" ? "" : selectedYear
    fetchData(`/api/top_rated_movies?year=${year}`)
        .then(data => renderTopRatedMoviesChart(data, year));
}
function handleMovieListGenreChange() {
    const genre = document.getElementById("genre-select").value;
    fetchData(`/api/movies_by_genre?genre=${genre}`)
        .then(data => renderMoviesTable(data));
}

// Fetch data and render charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchData('/api/top_movies_gross_profit').then(data => renderGrossProfitChart(data));
    fetchData('/api/top_movies_domestic_gross').then(data => renderDomesticGrossChart(data));
    fetchData('/api/gross_profit_by_genre').then(data => renderGenrePieChart(data));
    fetchData('/api/top_rated_movies').then(data => renderTopRatedMoviesChart(data));
    fetchData('/api/movies_by_genre').then(data => renderMoviesTable(data));

    // Add event handlers for select
    document.getElementById("gross-profit-year").addEventListener("change", handleGrossProfitYearChange);
    document.getElementById("domestic-gross-year").addEventListener("change", handleDomesticGrossYearChange);
    document.getElementById("genre-pie-year").addEventListener("change", handleGenrePieYearChange);
    document.getElementById("genre-select").addEventListener("change", handleMovieListGenreChange);
    document.getElementById("ratings-year").addEventListener("change", handleRatingsYearChange);
});
