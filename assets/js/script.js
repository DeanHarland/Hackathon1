// DOM QUERIES
// input field section
const inputField = document.querySelector("#input");
const submitButton = document.querySelector("#button");
// Summary section
const cityName = document.querySelector("#city-name");
const chanceRain = document.querySelector("#chance-rain");
const todayTemp = document.querySelector("#today-temp");
const mainIcon = document.querySelector("#main-icon");
// Todays forecast section
const todaysForecast = document.querySelector("#today-forecast");
// air conditions section
const realFeel = document.querySelector("#real-feel");
const Wind = document.querySelector("#wind");
const rainChance = document.querySelector("#air-rain-chance");
const windDirection = document.querySelector("#wind-direction");
// Seven day forecast sectiopn
const sevenDayForecast = document.getElementById("7-day-container");

// API KEY
let apiKey = "eee19215246ad04e764f70a75f17fda0";

// Event listen
submitButton.addEventListener("click", handleButtonClick);

// Focus the input field on page load
inputField.focus();

function handleButtonClick(e) {
    // Check if input is empty
    if (inputField.value === "") {
        alert("Please enter a location");
        return;
    }

    // Clear previous forecast
    todaysForecast.innerHTML = "";
    sevenDayForecast.innerHTML = "";

    // Get input text
    let locationName = inputField.value;

    // Build API URL for the entered location
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${locationName}&appid=${apiKey}&units=metric`;

    // Fetch weather data from OpenWeatherMap
    fetch(apiUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // Log API response for debugging
            console.log(data);

            // Display current weather information for main forecast
            let weatherIcon = data.list[0].weather[0].icon;
            mainIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@4x.png"></img>`;
            cityName.innerText = data.city.name;
            todayTemp.innerText = `${data.list[0].main.temp}°C`;
            chanceRain.innerText = `Chance of Rain: ${data.list[0].pop * 100}%`;

            // Display current weather information for air condition section
            realFeel.innerText = `${data.list[0].main.feels_like}°C`;
            Wind.innerText = `${data.list[0].wind.speed} m/s`;
            rainChance.innerText = `${data.list[0].pop * 100}%`;
            windDirection.innerText = `${data.list[0].wind.deg}°`;

            // Loop through the next 5 days and add forecast
            for (let i = 1; i <= 5; i++) {
                addForecast(data.list[i], i);
            }
        });
}

function addForecast(data, days) {
    // Main weather condition
    let headline = data.weather[0].main;
    // Icon code
    let weatherIcon = data.weather[0].icon;
    // Weather icon image
    let imgHtml = `<image src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png"></image>`;
    // Get the date from the API and format it
    let dateString = formatDate(data.dt);

    // Build HTML for the forecast
    let htmlString = `
            <div class="col-3">
                <span>${days} day(s) from now</span>
            </div>
            <div class="col-3">
                ${imgHtml}
            </div>
            <div class="col-3">
                <span>${headline}</h3>
            </div>
            <div class="col-3">
                <span>${dateString}</span>
            </div>
            `;

    // Append the forecast to the container
    sevenDayForecast.innerHTML += htmlString;
    inputField.value = "";
    inputField.focus();
}

// Convert Unix timestamp to readable date
function formatDate(unixTimestamp) {
    // Step 1: Multiply by 1000 (JavaScript needs milliseconds, not seconds)
    let milliseconds = unixTimestamp * 1000;

    // Step 2: Create a Date object
    let date = new Date(milliseconds);

    // Step 3: Set how we want the date to look
    let options = { day: "numeric", month: "short" };

    // Step 4: Convert to a readable string
    return date.toLocaleDateString("en-GB", options);
}
