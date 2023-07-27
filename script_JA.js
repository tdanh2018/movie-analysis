// Populate the year filter
d3.range(1977, 2020).forEach(year => {
  d3.select('#year')
    .append('option')
    .text(year)
    .attr('value', year);
});

// Add event listener to the year filter
d3.select('#year').on('change', function() {
  const year = d3.select(this).property('value');
  console.log('Selected year:', year); // Log the selected year
  updateVisualization(year);
});

// Initial visualization
updateVisualization(1977);

// Update visualization function
function updateVisualization(year) {
  // Clear the current visualization
  d3.select('#movies').html('');

  // Fetch data and create the visualization
  fetch(`http://localhost:3000/movies/${year}`)
  .then(response => {
      console.log('Fetch response:', response); // Log the fetch response
      return response.json();
  })
  .then(data => {
      console.log('Data:', data); // Log the data
      data.forEach(movie => {
          const movieDiv = d3.select('#movies')
          .append('div')
          .attr('class', 'movie');

          movieDiv.append('h2').text(movie.title);
          movieDiv.append('p').text(`Worldwide revenue: ${movie["Worlwide revenue"]}`);

          // Parse the percentages
          const domesticPercentage = parseFloat(movie["Domestic Percentage"].replace('%', ''));
          const foreignPercentage = parseFloat(movie["Foreign Percentage"].replace('%', ''));

          console.log('Parsed percentages:', domesticPercentage, foreignPercentage); // Log the parsed percentages

          // Define the pie chart data
          const pieData = [
              { name: 'Domestic', percentage: domesticPercentage },
              { name: 'Foreign', percentage: foreignPercentage }
          ];

          // Define the pie chart dimensions
          const width = 200;
          const height = 200;
          const radius = Math.min(width, height) / 2;

          // Define the pie chart layout
          const pie = d3.pie().value(d => d.percentage);
          const arc = d3.arc().innerRadius(0).outerRadius(radius);

          // Define the pie chart colors
          const color = d3.scaleOrdinal(['#4daf4a', '#377eb8']);

          // Create the SVG element
          const svg = movieDiv
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')
              .attr('transform', `translate(${width / 2}, ${height / 2})`)
              .style('border', '1px solid black'); // add a border to the SVG

          // Draw the pie chart
          const path = svg.selectAll('path')
              .data(pie(pieData))
              .enter()
              .append('path')
              .attr('d', arc)
              .attr('fill', (d, i) => color(i));
      });
  });
}






