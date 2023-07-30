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
        xaxis: { title: '' },
        yaxis: { title: 'Amount ($)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        barmode: 'group', // This will group the bars for Gross Profit and Budget side by side
        margin: {
            b: 150
        }
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
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)'

    };

    Plotly.newPlot('genre-pie-chart', [genrePieChart], genrePieLayout, { responsive: true });
}
// original - delete when replaced
// Function to render the Top 10 Rated Movies bar chart
// function renderTopRatedMoviesChart(data, year = "") {
//     const topRatedMoviesChart = {
//         x: data.data.map(movie => movie.title),
//         y: data.data.map(movie => movie.imdb_rating),
//         type: 'bar',
//         marker: {
//             color: 'rgb(148, 103, 189)',
//         },

//     };

//     const topRatedMoviesLayout = {
//         title: `Top 10 Rated Movies ${year ? `In ${year}` : ""}`,
//         xaxis: { title: '' },
//         yaxis: { title: 'IMDb Rating' },
//         plot_bgcolor: 'rgba(0,0,0,0)',
//         paper_bgcolor: 'rgba(0,0,0,0)',
//         margin: {
//             b: 170
//         }
//     };

//     Plotly.newPlot('top-rated-movies-chart', [topRatedMoviesChart], topRatedMoviesLayout, { responsive: true });
// }

// new
function normalizeValues(values, desiredMin, desiredMax) {
    const actualMin = Math.min(...values);
    const actualMax = Math.max(...values);

    // Log for debugging
    console.log("actualMin: ", actualMin);
    console.log("actualMax: ", actualMax);

    // Check if all values are the same
    if (actualMax - actualMin === 0) {
        console.log("All values are the same.");
        // If so, return an array of desiredMin values
        return values.map(value => desiredMin);
    }
    
    return values.map(value => 
        ((value - actualMin) / (actualMax - actualMin)) * (desiredMax - desiredMin) + desiredMin
    );
}

function renderTopRatedMoviesChart(data, year = "") {
    const worldwideGrosses = data.data.map(movie => parseFloat(movie.worldwide_gross));
    const normalizedSizes = normalizeValues(worldwideGrosses, 10, 50); 

    const topRatedMoviesChart = {
        x: data.data.map(movie => movie.title),
        y: data.data.map(movie => movie.imdb_rating),
        mode: 'markers',
        marker: {
            color: 'rgb(148, 103, 189)',
            size: normalizedSizes,
            sizemode: 'diameter',
        },
        text: data.data.map(movie => `Title: ${movie.title}<br>Worldwide Gross: ${movie.worldwide_gross}`),
        hovertemplate: '%{text}<br>Rating: %{y}<extra></extra>',
        type: 'scatter'
    };

    const topRatedMoviesLayout = {
        title: `Top 10 Rated Movies ${year ? `In ${year}` : ""}`,
        xaxis: { title: '' },
        yaxis: { title: 'IMDb Rating' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        margin: {
            b: 170
        }
    };

    Plotly.newPlot('top-rated-movies-chart', [topRatedMoviesChart], topRatedMoviesLayout, { responsive: true });
}


// end new

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
        xaxis: { title: '' },
        yaxis: { title: 'Amount ($)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        barmode: 'group',
        margin: {
            b: 150
        }
    };

    Plotly.newPlot('domestic-gross-chart', [domesticGrossChart, budgetChart], domesticGrossLayout, { responsive: true });
}
// Function to render the Top 10 Movies Based on Foreign Gross chart
function renderForeignGrossChart(data, year = "") {
    const foreignGrossChart = {
        x: data.data.map(movie => movie.title),
        y: data.data.map(movie => movie.foreign_gross),
        type: 'bar',

        name: 'Foreign Gross'
    };

    const budgetChart = {
        x: data.data.map(movie => movie.title),
        y: data.data.map(movie => movie.budget),
        type: 'bar',

        name: 'Budget'
    };

    const foreignGrossLayout = {
        title: `Top 10 Movies ${year ? `In ${year}` : ""} Based on Foreign Gross and Budget ($)`,
        xaxis: { title: '' },
        yaxis: { title: 'Amount ($)' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        barmode: 'group',
        margin: {
            b: 150
        }
    };

    Plotly.newPlot('foreign-gross-chart', [foreignGrossChart, budgetChart], foreignGrossLayout, { responsive: true });
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
                <td>${movie.worldwide_gross}</td>
                <td>${movie.domestic_gross}</td>
                <td>${movie.foreign_gross}</td>
                
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

function handleForeignGrossYearChange() {
    const selectedYear = document.getElementById("foreign-gross-year").value;
    const year = selectedYear == "all" ? "" : selectedYear
    fetchData(`/api/top_movies_foreign_gross?year=${year}`)
        .then(data => renderForeignGrossChart(data, year));
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
    fetchData('/api/top_movies_foreign_gross').then(data => renderForeignGrossChart(data));
    fetchData('/api/gross_profit_by_genre').then(data => renderGenrePieChart(data));
    fetchData('/api/top_rated_movies').then(data => renderTopRatedMoviesChart(data));
    fetchData('/api/movies_by_genre').then(data => renderMoviesTable(data));

    // Add event handlers for select
    document.getElementById("gross-profit-year").addEventListener("change", handleGrossProfitYearChange);
    document.getElementById("domestic-gross-year").addEventListener("change", handleDomesticGrossYearChange);
    document.getElementById("foreign-gross-year").addEventListener("change", handleForeignGrossYearChange);
    document.getElementById("genre-pie-year").addEventListener("change", handleGenrePieYearChange);
    document.getElementById("genre-select").addEventListener("change", handleMovieListGenreChange);
    // document.getElementById("ratings-year").addEventListener("change", handleRatingsYearChange);
    // Here is how you can call the function when dropdown selection changes
    document.getElementById('ratings-year').addEventListener('change', async function() {
    const year = this.value;
    // Assuming fetchData is your function to fetch data for a given year
    fetchData(`/api/top_rated_movies?year=${year}`).then(data => {
        renderTopRatedMoviesChart(data, year);
    });
});
});
