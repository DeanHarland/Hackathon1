// DOM QUERIES
// input field section
const inputField = document.querySelector('#input');
const submitButton = document.querySelector('#button');
// Summary section
const cityName = document.querySelector('#city-name');
const chanceRain = document.querySelector('#chance-rain');
const todayTemp = document.querySelector('#today-temp');
const mainIcon = document.querySelector('#main-icon');
// Todays forecast section
const todaysForecast = document.querySelector('#today-forecast');
// air conditions section
const realFeel = document.querySelector('#real-feel');
const Wind = document.querySelector('#wind');
const rainChance = document.querySelector('#air-rain-chance');
const uvIndex = document.querySelector('#uv-index');
// Seven day forecast sectiopn
const sevenDayForecast = document.getElementById('7-day-container');

// API KEY
let apikey= 'f9eb5f9c591eee6ccbbdcae90704650d';

// Event listen
submitButton.addEventListener("click", handleButtonClick);


// Focus the input field on page load
// inputElement.focus();

function handleButtonClick(){

};
