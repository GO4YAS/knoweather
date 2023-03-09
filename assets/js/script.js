var today = new Date();
var cityForm = document.querySelector("#city-form");
var cityNameInput = document.querySelector("#cityname");
var currentWeather = document.querySelector('#current-weather');
var currentWeatherCard = document.querySelector("#current-weather-card")
var weeklyCard = document.querySelector("#weekly-card");
var weeklyBody = document.querySelector("#weekly-body");
var weatherStatus = document.querySelector('#weather-status');
var search = document.querySelector('#search');
var historyButtons = document.querySelector("#history-buttons")
var historyCard = document.querySelector("#history")
var trash = document.querySelector("#trash")


var searchHistoryArray = []
var formSubmitHandler = function (event) {
    event.preventDefault();
    // get city name value from input element
    var cityname = cityNameInput.value.trim();

    // Set city name in local storage and generate history buttons
    if (cityname) {
        searchHistoryArray.push(cityname);
        localStorage.setItem("weatherSearch", JSON.stringify(searchHistoryArray));
        var searchHistory = document.createElement('button');
        searchHistory.className = "btn";
        searchHistory.setAttribute("data-city", cityname)
        searchHistory.innerHTML = cityname;
        historyButtons.appendChild(searchHistory);
        historyCard.removeAttribute("style")
        getWeatherInfo(cityname);
        cityNameInput.value = "";
    }
    else {
        alert("Please enter a City name");
    }

}

// Get weather information from OpenWeather
var getWeatherInfo = function (cityname) {
    var apiCityUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityname + "&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";
    fetch(
        // Make a fetch request using city name to get latitude and longitude for city
        apiCityUrl
    )
        .then(function (cityResponse) {
            return cityResponse.json();
        })
        .then(function (cityResponse) {
            // Create variables to hold the latitude and longitude of requested city
            console.log(cityResponse)
            var latitude = cityResponse.coord.lat;
            var longitude = cityResponse.coord.lon;

            // Create variables for City name, current date and icon information for use in current Weather heading
            var city = cityResponse.name;
            var date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
            var weatherIcon = cityResponse.weather[0].icon;
            var weatherDescription = cityResponse.weather[0].description;
            var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"

            // Empty Current Weather element for new data
            currentWeather.textContent = "";
            weeklyBody.textContent = "";