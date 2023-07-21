// Import required libraries
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();

// Your IMDb API key
const API_KEY = 'YOUR_IMDB_API_KEY';

// Function to fetch data from IMDb API
async function fetchDataFromAPI() {
  try {
    const response = await axios.get(`https://api.imdb.com/some_endpoint?api_key=${API_KEY}`);
    const data = response.data; // Adjust this based on the API response format
    return data;
  } catch (error) {
    console.error('Error fetching data from IMDb API:', error);
    throw error;
  }
}

// Function to store data in SQLite database
function storeDataInSQLite(data) {
  const db = new sqlite3.Database('imdb_data.db', (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
      throw err;
    }
    console.log('Connected to the SQLite database.');
  });

  // Create a table (if it doesn't exist) to store IMDb data
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS movies (
      id INTEGER PRIMARY KEY,
      title TEXT,
      release_year INTEGER,
      rating REAL
    );
  `;

  db.run(createTableQuery, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
      throw err;
    }
    console.log('Table "movies" created or already exists.');
  });

  // Insert data into the table
  const insertDataQuery = 'INSERT INTO movies (title, release_year, rating) VALUES (?, ?, ?)';
  data.forEach((movie) => {
    db.run(insertDataQuery, [movie.title, movie.release_year, movie.rating], (err) => {
      if (err) {
        console.error('Error inserting data:', err.message);
        throw err;
      }
      console.log('Data inserted:', movie.title);
    });
  });

  // Close the database connection after inserting all data
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
      throw err;
    }
    console.log('Database connection closed.');
  });
}

// Main function to execute the process
async function main() {
  try {
    const data = await fetchDataFromAPI();
    storeDataInSQLite(data);
  } catch (error) {
    console.error('Error in the main process:', error);
  }
}

// Call the main function to start the process
main();
