const app = document.querySelector(".index");
const temp = document.querySelector(".temp");
const dateOutput = document.querySelector(".date");
const timeOutput = document.querySelector(".time");
const conditionOutput = document.querySelector(".condition");
const nameOutput = document.querySelector(".name");
const icon = document.querySelector(".icon");
const cloudOutput = document.querySelector(".cloud");
const humidityOutput = document.querySelector(".humidity");
const windOutput = document.querySelector(".wind");
const form = document.getElementById("locationInput");
const search = document.querySelector(".search");
const btn = document.querySelector(".submit");
const cities = document.querySelectorAll(".city");

let cityInput = "Manila";

// Event listeners for city buttons
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        app.style.opacity = "0";
    });
});

// Event listener for form submission
form.addEventListener("submit", (e) => {
    if (search.value.length == 0) {
        alert("Please type a city name!");
    } else {
        cityInput = search.value;
        fetchWeatherData();
        search.value = "";
        app.style.opacity = "0";
    }

    e.preventDefault();
});

// Function to get the day of the week
function dayOfTheWeek(day, month, year) {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
}

// Fetch weather data
function fetchWeatherData() {
    fetch(`http://api.weatherapi.com/v1/current.json?key=62ace37ede0348ccbb0151402241210&q=${cityInput}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            temp.innerHTML = data.current.temp_c + "&#176;";
            conditionOutput.innerHTML = data.current.condition.text;

            const date = data.location.localtime;
            const y = parseInt(date.substr(0, 4));
            const m = parseInt(date.substr(5, 2));
            const d = parseInt(date.substr(8, 2));
            const time = date.substr(11);

            dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
            timeOutput.innerHTML = time;
            nameOutput.innerHTML = data.location.name;

            // Set weather icon
            const iconId = data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
            icon.src = "./icons/" + iconId;

            cloudOutput.innerHTML = data.current.cloud + "%";
            humidityOutput.innerHTML = data.current.humidity + "%";
            windOutput.innerHTML = data.current.wind_kph + "km/h";

            // Determine time of day and condition code
            let timeOfDay = data.current.is_day ? "day" : "night";
            const code = data.current.condition.code;

            // Set background and button colors based on weather condition code
            if (code === 1000) { // Clear weather
                app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
                app.style.backgroundSize = "cover";
                btn.style.background = timeOfDay === "day" ? "#e5ba92" : "#181e27";
            } else if ([1003, 1006, 1009, 1030, 1069, 1087, 1135, 1273, 1276, 1279, 1282].includes(code)) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
                app.style.backgroundSize = "cover";
                btn.style.background = timeOfDay === "day" ? "#fa6d1b" : "#181e27";
            } else if ([1063, 1069, 1072, 1150, 1180, 1183, 1186, 1189, 1192, 1195, 1204, 1207, 1240, 1243, 1246, 1249, 1252].includes(code)) {
                app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
                app.style.backgroundSize = "cover";
                btn.style.background = timeOfDay === "day" ? "#647d75" : "#325c80";
            } else {
                app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
                app.style.backgroundSize = "cover";
                btn.style.background = timeOfDay === "day" ? "#4d72aa" : "#1b1b1b";
            }

            // Fade in the app
            app.style.opacity = "1";
        })
        .catch(() => {
            alert("City not found, please try again!");
            app.style.opacity = "1";
        });
}

// Initial weather data fetch for default city
fetchWeatherData();
app.style.opacity = "1";
daada