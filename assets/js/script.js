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

            // Update <h2> element to show city, date and icon
            weatherStatus.innerHTML = city + " (" + date + ") " + weatherIconLink;

            // Remove class name 'hidden' to show current weather card
            currentWeatherCard.classList.remove("hidden");
            weeklyCard.classList.remove("hidden");

            // Return a fetch request to the OpenWeather using longitude and latitude from pervious fetch
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&exclude=alerts,minutely,hourly&units=imperial&appid=f97301447cbd41068af8623a398ba1fb');
        })
        .then(function (response) {
            // return response in json format
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            // send response data to displayWeather function for final display 
            displayWeather(response);

        });
};

// Display the weather on page
var displayWeather = function (weather) {
    // check if api returned any weather data
    if (weather.length === 0) {
        weatherContainer.textContent = "No weather data found.";
        return;
    }
    // Create Temperature element
    var temperature = document.createElement('p');
    temperature.id = "temperature";
    temperature.innerHTML = "<strong>Temperature:</strong> " + weather.current.temp.toFixed(1) + "°F";
    currentWeather.appendChild(temperature);

    // Create Humidity element
    var humidity = document.createElement('p');
    humidity.id = "humidity";
    humidity.innerHTML = "<strong>Humidity:</strong> " + weather.current.humidity + "%";
    currentWeather.appendChild(humidity);

    // Create Wind Speed element
    var windSpeed = document.createElement('p');
    windSpeed.id = "wind-speed";
    windSpeed.innerHTML = "<strong>Wind Speed:</strong> " + weather.current.wind_speed.toFixed(1) + " MPH";
    currentWeather.appendChild(windSpeed);

    // Create uv-index element
    var uvIndex = document.createElement('p');
    var uvIndexValue = weather.current.uvi.toFixed(1);
    uvIndex.id = "uv-index";
    if (uvIndexValue >= 0) {
        uvIndex.className = "uv-index-green"
    }
    if (uvIndexValue >= 3) {
        uvIndex.className = "uv-index-yellow"
    }
    if (uvIndexValue >= 8) {
        uvIndex.className = "uv-index-red"
    }
    uvIndex.innerHTML = "<strong>UV Index:</strong> <span>" + uvIndexValue + "</span>";
    currentWeather.appendChild(uvIndex);

     // Get extended forecast data
     var forecastArray = weather.daily;

     // Create day cards for extended forecast
     for (let i = 0; i < forecastArray.length - 3; i++) {
         var date = (today.getMonth() + 1) + '/' + (today.getDate() + i + 1) + '/' + today.getFullYear();
         var weatherIcon = forecastArray[i].weather[0].icon;
         var weatherDescription = forecastArray[i].weather[0].description;
         var weatherIconLink = "<img src='http://openweathermap.org/img/wn/" + weatherIcon + "@2x.png' alt='" + weatherDescription + "' title='" + weatherDescription + "'  />"
         var day = document.createElement("div");
         day.className = "day";
         day.innerHTML = "<p><strong>" + date + "</strong></p>" +
             "<p>" + weatherIconLink + "</p>" +
             "<p><strong>Temp:</strong> " + forecastArray[i].temp.day.toFixed(1) + "°F</p>" +
             "<p><strong>Humidity:</strong> " + forecastArray[i].humidity + "%</p>"
 
         weeklyBody.appendChild(day);
 
     }
 
 }
 
 // Load any past city weather searches
var loadHistory = function () {
    searchArray = JSON.parse(localStorage.getItem("weatherSearch"));

    if (searchArray) {
        searchHistoryArray = JSON.parse(localStorage.getItem("weatherSearch"));
        for (let i = 0; i < searchArray.length; i++) {
            var searchHistory = document.createElement('button');
            searchHistory.className = "btn";
            searchHistory.setAttribute("data-city", searchArray[i])
            searchHistory.innerHTML = searchArray[i];
            historyButtons.appendChild(searchHistory);
            historyCard.removeAttribute("style");
        }

    }
}

// Search weather using search history buttons
var buttonClickHandler = function (event) {
    var cityname = event.target.getAttribute("data-city");
    if (cityname) {
        getWeatherInfo(cityname);
    }
}

// Clear Search History
var clearHistory = function (event) {
    localStorage.removeItem("weatherSearch");
    historyCard.setAttribute("style", "display: none");
}

cityForm.addEventListener("submit", formSubmitHandler);
historyButtons.addEventListener("click", buttonClickHandler);
trash.addEventListener("click", clearHistory);

loadHistory();