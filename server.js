const express = require('express');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = 9080;

// Set the template engine to EJS
app.set('view engine', 'ejs');

// Serve static files from the public directory
app.use(express.static('public'));

// Function to capitalize the first letter of the city name
function capitalizeCity(cityName) {
  return cityName.charAt(0).toUpperCase() + cityName.slice(1);
}

app.get('/', (req, res) => {
  res.render('index', { weather: null, error: null });
});

app.get('/weather', async (req, res) => {
  const city = req.query.city; // Get the city from the query parameter

  if (!city) {
    return res.render('index', { weather: null, error: 'Please enter a city name!' });
  }

  const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.WEATHER_API_KEY}`;

  try {
    const response = await axios.get(apiURL);
    const weather = response.data;

    // Prepare data to send to the template
    const weatherData = {
      city: capitalizeCity(weather.name),
      temperature: weather.main.temp,
      humidity: weather.main.humidity,
      description: weather.weather[0].description,
    };

    res.render('index', { weather: weatherData, error: null });
  } catch (error) {
    console.log('Error fetching weather:', error); // Log the error for debugging
    res.render('index', { weather: null, error: 'City not found. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
