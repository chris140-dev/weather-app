import "./style.css";

import rain from "./images/rain.jpg";
import snow from "./images/snow.jpg";
import cloudy from "./images/cloudy.jpg";
import clear from "./images/clear.jpg";

const form = document.querySelector("form");
const celsius = document.querySelector("#celsius");
const fahrenheit = document.querySelector("#fahrenheit");
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  console.log("form submitted!");

  const location = document.querySelector("input").value;
  const weather = document.querySelector("#weather");
  const forecast = document.querySelector("#forecast");

  weather.innerHTML = "<p>Loading weather...</p>";

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=35R348RMXQJDM7JUFMYMXGNZ2`,
    );

    if (!response.ok) {
      throw new Error("Location not found");
    }

    const data = await response.json();

    // BACKGROUND
    const condition = data.currentConditions.icon;
    const body = document.querySelector("body");

    if (condition.includes("rain")) {
      body.style.backgroundImage = `url(${rain})`;
    } else if (condition.includes("snow")) {
      body.style.backgroundImage = `url(${snow})`;
    } else if (
      condition.includes("cloudy") ||
      condition.includes("partly-cloudy")
    ) {
      body.style.backgroundImage = `url(${cloudy})`;
    } else if (condition.includes("clear")) {
      body.style.backgroundImage = `url(${clear})`;
    }

    // CURRENT WEATHER
    weather.innerHTML = `
      <h2>${data.resolvedAddress}</h2>
      <h1 id="current-temp">${data.currentConditions.temp}°C</h1>
      <p>${data.currentConditions.conditions}</p>
      <p>💧 Humidity: ${data.currentConditions.humidity}%</p>
      <p>💨 Wind: ${data.currentConditions.windspeed} km/h</p>
    `;

    // FORECAST
    forecast.innerHTML = "";

    data.days.forEach((day) => {
      forecast.innerHTML += `
        <div>
          <img
            src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/4th%20Set%20-%20Color/${day.icon}.png"
            alt="${day.conditions}"
          >
          <h3>${day.datetime}</h3>
          <p class="high-temp">High: ${day.tempmax}°C</p>
          <p class="low-temp">Low: ${day.tempmin}°C</p>
          <p>${day.conditions}</p>
        </div>
      `;
    });
  } catch (error) {
    console.error(error);

    weather.innerHTML = `
      <p>❌ Could not find that location.</p>
    `;

    forecast.innerHTML = "";
  }
});
