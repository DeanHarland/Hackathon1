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
const todaysForecastTitle = document.querySelector("#today-forecast-title");
const todaysForecast = document.querySelector("#today-forecast");
// Main containers
const mainForecastContainer = document.querySelector(
    "#main-forecast-container"
);
const weeklyForecastContainer = document.querySelector(
    "#weekly-forecast-container"
);
// air conditions section
const realFeel = document.querySelector("#real-feel");
const Wind = document.querySelector("#wind");
const rainChance = document.querySelector("#air-rain-chance");
const windDirection = document.querySelector("#wind-direction");
const windArrow = document.getElementById("wind-arrow");
// Seven day forecast sectiopn
const weeklyForecastTitle = document.querySelector("#weekly-forecast-title");
const sevenDayForecast = document.getElementById("7-day-container");

// API KEY
let apiKey = "eee19215246ad04e764f70a75f17fda0";

// Event listeners
submitButton.addEventListener("click", handleButtonClick);
inputField.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        handleButtonClick(e);
    }
});

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

            // Show the forecast containers
            mainForecastContainer.style.display = "block";
            weeklyForecastContainer.style.display = "block";

            // Display current weather information for main forecast
            let weatherIcon = data.list[0].weather[0].icon;
            mainIcon.innerHTML = `<img src="https://openweathermap.org/img/wn/${weatherIcon}@4x.png"></img>`;
            cityName.innerText = data.city.name;
            todayTemp.innerText = `${Math.round(data.list[0].main.temp)}°C`;
            chanceRain.innerText = `Chance of Rain: ${data.list[0].pop * 100}%`;

            // Display current weather information for air condition section
            realFeel.innerText = `${Math.round(
                data.list[0].main.feels_like
            )}°C`;
            Wind.innerText = `${data.list[0].wind.speed} m/s`;
            rainChance.innerText = `${data.list[0].pop * 100}%`;

            // Set wind direction
            let windDegrees = data.list[0].wind.deg;
            setWindDirection(windDegrees);

            // Add today's forecast title
            weeklyForecastTitle.innerText = "Weekly Forecast";

            // Loop through the next 5 days and add forecast(Because there are 3 hours intervals so 8 is full day)
            for (let i = 1; i <= 5; i++) {
                addForecast(data.list[i * 8 - 1], i);
            }

            // Add today's forecast title
            todaysForecastTitle.innerText = "Today's Forecast";

            // Loop through the 6 blocks of hours
            for (let i = 1; i <= 6; i++) {
                addTodaysForecast(data.list[i], i);
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
    let weekday = formatWeekday(data.dt);
    let dateString = formatDate(data.dt);

    // Build HTML for the forecast
    let htmlString = `
            <div class="col-2">
                <span>${weekday}</span>
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

function addTodaysForecast(data) {
    let weatherIcon = data.weather[0].icon;
    // time
    let timeString = formatTime(data.dt);
    // Weather Icon
    let imgHtml = `<image src="https://openweathermap.org/img/wn/${weatherIcon}@2x.png"></image>`;
    // temp
    let temp = `${Math.round(data.main.temp)}°C`;

    // Build HTML for the forecast
    let htmlString = `
            <div class="col-6 col-sm-4 col-xl-2 mb-3">
                <span>${timeString}</span>
                <br>
                 ${imgHtml}
                 <br>
                <span>${temp}</h3>
            </div>
            `;

    todaysForecast.innerHTML += htmlString;
    inputField.value = "";
    inputField.focus();
}

// Set wind direction arrow and label
function setWindDirection(windDegrees) {
    // 1. Define the 8 directions
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    // 2. Math to find which of the 8 segments the degree falls into
    // We add 22.5 so that "North" spans from -22.5 to +22.5
    let index = Math.round(windDegrees / 45) % 8;

    // 3. The rounded degree for the arrow (0, 45, 90, 135, etc.)
    let snappedDeg = index * 45;

    // 4. Update the UI
    windArrow.style.transform = `rotate(${snappedDeg}deg)`;

    windDirection.innerText = directions[index];

    console.log(
        `API said: ${windDegrees}°. Snapped to: ${directions[index]} (${snappedDeg}°)`
    );
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

// Convert Unix timestamp to readable time (e.g. 12:00pm)
function formatTime(unixTimestamp) {
    // Convert seconds to milliseconds
    let milliseconds = unixTimestamp * 1000;

    // Create Date object
    let date = new Date(milliseconds);

    // Format options for 12-hour time with am/pm
    let options = {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    };

    // Convert to readable string
    return date.toLocaleTimeString("en-GB", options).toLowerCase();
}

// Convert Unix timestamp to weekday (e.g. Mon, Tue, Wed)
function formatWeekday(unixTimestamp) {
    let milliseconds = unixTimestamp * 1000;
    let date = new Date(milliseconds);
    let options = { weekday: "short" };
    return date.toLocaleDateString("en-GB", options);
}
