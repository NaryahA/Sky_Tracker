const weatherApiKey = '7ef83d28280d127f242c2a20cdb05f1a';
const ticketmasterApiKey = 'l7lnMA4sPyZXAkzgQqjbeBHIB7D6cnl5'; 

let cities = JSON.parse(localStorage.getItem('cities')) || [];

// Convert Kelvin to Fahrenheit
function kelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9 / 5 + 32;
}

// Display current weather for the city
function displayCityInCurrentWeather(city, cityData) {
    const date = new Date(cityData.dt * 1000).toLocaleDateString();
    const icon = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`;
    const temp = (cityData.main.temp - 273.15).toFixed(1);
    
    // Display in the DOM
    const weatherInfo = `
        <div class="box">
            <h2 class="title is-4">Weather in ${city}, ${cityData.sys.country}</h2>
            <img src="${icon}" alt="Weather icon">
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Temperature:</strong> ${temp} °C</p>
            <p><strong>Weather:</strong> ${cityData.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${cityData.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${cityData.wind.speed} m/s</p>
        </div>
    `;
    document.getElementById('currentWeather').innerHTML = weatherInfo;

    // Suggestion based on weather description
    let suggestion = '';
    const weatherDescription = cityData.weather[0].description.toLowerCase();
    if (weatherDescription.includes('rain')) {
        suggestion = "Make sure to bring an umbrella!";
    } else if (weatherDescription.includes('clear')) {
        suggestion = "Stay hydrated!";
    } else if (weatherDescription.includes('cloud')) {
        suggestion = "You might want to bring some layers!";
    } else {
        suggestion = "Consider preparing appropriately for the weather.";
    }
    document.getElementById('weatherSuggestion').innerHTML = `<p>${suggestion}</p>`;
}

// Get weather data for the entered city
function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherApiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayCityInCurrentWeather(city, data);
            // Store city in local storage
            if (!cities.includes(city)) {
                cities.push(city);
                localStorage.setItem('cities', JSON.stringify(cities));
                renderCities();
            }
        })
        .catch(error => {
            console.error('There was a problem fetching the weather data:', error);
            document.getElementById('results').innerHTML = '<p class="has-text-danger">Failed to fetch weather data</p>';
        });
}

function getForecast(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherApiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
           console.log (data)
           const filteredData = data.list.filter(item =>{
            return item.dt_txt.includes("12:00:00")
           })
           console.log(filteredData)
           for (let index = 0; index < filteredData.length; index++) {
            const cityData = filteredData[index];
            displayForecastCard(city, cityData, index + 1)
           }
        })

        .catch(error => {
            console.error('There was a problem fetching the weather data:', error);
            document.getElementById('results').innerHTML = '<p class="has-text-danger">Failed to fetch weather data</p>';
        });
}

// Render previously searched cities
function renderCities() {
    const citiesList = document.getElementById('cities-List');
    citiesList.innerHTML = '';

    cities.forEach((city, index) => {
        const li = document.createElement('li');
        li.textContent = city;
        li.setAttribute('data-index', index);
        citiesList.appendChild(li);
    });
}

// Initialize the application
function init() {
    renderCities();
}

// Event listener for the search form
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();

    if (city) {
        getWeather(city);
        getForecast(city);
        cityInput.value = '';
    } else {
        alert('Please enter a city name');
    }
});

function displayForecastCard(city, cityData, index) {
    const date = new Date(cityData.dt * 1000).toLocaleDateString();
    const icon = `https://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`;
    const temp = (cityData.main.temp - 273.15).toFixed(1);
    
    // Display in the DOM
    const weatherInfo = `
        <div class="box">
            <img src="${icon}" alt="Weather icon">
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Temperature:</strong> ${temp} °C</p>
            <p><strong>Weather:</strong> ${cityData.weather[0].description}</p>
            <p><strong>Humidity:</strong> ${cityData.main.humidity}%</p>
            <p><strong>Wind Speed:</strong> ${cityData.wind.speed} m/s</p>
        </div>
    `;
    document.getElementById('Day-'+ index).innerHTML = weatherInfo;
}
// Initialize the app
init();